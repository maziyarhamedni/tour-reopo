"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const reviewController_1 = __importDefault(require("./../controller/reviewController"));
const authController_1 = __importDefault(require("./../controller/authController"));
const authorize = new authController_1.default();
const reviewControlerObj = new reviewController_1.default();
const reviewRouter = express_1.default.Router();
//////
////  i must be declare restapi again
//////
//////
///////
reviewRouter.use(authorize.protect);
reviewRouter
    .route('/:tourId')
    .get(reviewControlerObj.getAll)
    .post(authorize.authorizeAdmin('USER'), reviewControlerObj.setTourUserIds, reviewControlerObj.createOne);
reviewRouter
    .route('/s1/:id')
    .patch(authorize.authorizeAdmin('USER', 'ADMIN'), reviewControlerObj.updateOne)
    .get(reviewControlerObj.getReview)
    .delete(authorize.authorizeAdmin('USER', 'ADMIN'), reviewControlerObj.deleteOne);
module.exports = reviewRouter;
