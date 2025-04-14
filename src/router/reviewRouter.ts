import express from 'express';
import reviewController from './../controller/reviewController';
import authController from './../controller/authController';
const authorize = new authController();
const reviewControlerObj = new reviewController();
const reviewRouter = express.Router();

//////
////  i must be declare restapi again
//////
//////
///////
reviewRouter.use(authorize.protect);

reviewRouter
  .route('/:tourId')
  .get(reviewControlerObj.getAll)

  .post(
    authorize.authorizeAdmin('USER'),
    reviewControlerObj.setTourUserIds,
    reviewControlerObj.createOne
  );

reviewRouter
  .route('/s1/:id')
  .patch(
    authorize.authorizeAdmin('USER', 'ADMIN'),
    reviewControlerObj.updateOne
  )
  .get(reviewControlerObj.getReview)
  .delete(
    authorize.authorizeAdmin('USER', 'ADMIN'),
    reviewControlerObj.deleteOne
  );

export = reviewRouter;
