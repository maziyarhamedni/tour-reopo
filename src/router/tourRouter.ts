import express from 'express';
import TourController from './../controller/tourController';
import authController from './../controller/authController';
const tourRouter = express.Router();
const controller = new TourController();
const authcontrol = new authController();

tourRouter
  .route('/')
  .get(controller.getAllTours)
  .post(
    authcontrol.protect,
    authcontrol.accessRoleIs('ADMIN', 'TOURLEADER'),
    controller.createTour
  );


// tourRouter
//   .route('/tours-within/:distance/center/:latlng/unit/:unit')
//   .get(controller.tourWhitn);



tourRouter
  .route('/:id')
  .get(authcontrol.protect, controller.getTour)
  .patch(
    authcontrol.protect,
    authcontrol.accessRoleIs('ADMIN', 'TOURLEADER'),
    controller.updateTour
  )
  .delete(
    authcontrol.protect,
    authcontrol.accessRoleIs('ADMIN', 'TOURLEADER'),
    controller.deleteTour
  );
  // tourRouter.route('/:id/card').post(
  //   authcontrol.protect,

      
  // )
tourRouter
  .route('/:id/startLocation')
  .post(
    authcontrol.protect,
    authcontrol.accessRoleIs('ADMIN', 'TOURLEADER'),
    controller.addStartLoc
  );
tourRouter
  .route('/:id/addLocation')
  .post(
    authcontrol.protect,
    authcontrol.accessRoleIs('ADMIN', 'TOURLEADER'),
    controller.addLoc
  );

tourRouter
  .route('/:id/addTourGuider')
  .post(
    authcontrol.protect,
    authcontrol.accessRoleIs('ADMIN'),
    controller.addTourGuides
  );

export default tourRouter;
