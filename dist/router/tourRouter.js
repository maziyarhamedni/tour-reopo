"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tourController_1 = __importDefault(require("./../controller/tourController"));
const authController_1 = __importDefault(require("./../controller/authController"));
const tourRouter = express_1.default.Router();
const controller = new tourController_1.default();
const authcontrol = new authController_1.default();
tourRouter
    .route('/')
    .get(controller.getAllTours)
    .post(authcontrol.protect, authcontrol.authorizeAdmin('ADMIN', 'TOURLEADER'), controller.createTour);
// tourRouter
//   .route('/tours-within/:distance/center/:latlng/unit/:unit')
//   .get(controller.tourWhitn);
tourRouter
    .route('/:id')
    .get(authcontrol.protect, controller.getTour)
    .patch(authcontrol.protect, authcontrol.authorizeAdmin('ADMIN', 'TOURLEADER'), controller.updateTour)
    .delete(authcontrol.protect, authcontrol.authorizeAdmin('ADMIN', 'TOURLEADER'), controller.deleteTour);
// tourRouter.route('/:id/card').post(
//   authcontrol.protect,
// )
tourRouter
    .route('/:id/startLocation')
    .post(authcontrol.protect, authcontrol.authorizeAdmin('ADMIN', 'TOURLEADER'), controller.addStartLoc);
tourRouter
    .route('/:id/addLocation')
    .post(authcontrol.protect, authcontrol.authorizeAdmin('ADMIN', 'TOURLEADER'), controller.addLoc);
tourRouter
    .route('/:id/addTourGuider')
    .post(authcontrol.protect, authcontrol.authorizeAdmin('ADMIN'), controller.addTourGuides);
exports.default = tourRouter;
