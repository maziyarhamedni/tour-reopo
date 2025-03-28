import express from 'express';
import UserController from './../controller/userController.js';
import authController from '../controller/authController';

const userRouter = express.Router();
const controller = new UserController();
const authorize = new authController();

userRouter.post('/signup', authorize.signUp);
userRouter.post('/login', authorize.logIn);
userRouter.post('/forgotPassword', authorize.forgotPassword);
userRouter.patch(
  '/updatepassword',
  authorize.protect,
  authorize.updatePassword
);
userRouter.patch('/resetPassword/:token', authorize.resetPassword);

userRouter.route('/').get(controller.getAllUsers);

userRouter
  .route('/:id')
  .get(controller.getUser)
  .patch(controller.updateUser)
  .delete(
    authorize.protect,
    authorize.authorizeAdmin('ADMIN'),
    authorize.deleteUser
  );

export default userRouter;
