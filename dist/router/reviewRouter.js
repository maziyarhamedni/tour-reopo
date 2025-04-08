import express from 'express';
import reviewController from './../controller/reviewController';
import authController from './../controller/authController';
const authorize = new authController();
const reviewControlerObj = new reviewController();
const reviewRouter = express.Router({ mergeParams: true });
reviewRouter.use(authorize.protect);
reviewRouter
    .route('/:tourId')
    .get(reviewControlerObj.getAll)
    .post(authorize.authorizeAdmin('USER'), reviewControlerObj.setTourUserIds, reviewControlerObj.createOne);
reviewRouter
    .route('/:id')
    .get(reviewControlerObj.getOne)
    .patch(authorize.authorizeAdmin('USER', 'ADMIN'), reviewControlerObj.updateOne)
    .delete(authorize.authorizeAdmin('USER', 'ADMIN'), reviewControlerObj.deleteOne);
export default reviewRouter;
