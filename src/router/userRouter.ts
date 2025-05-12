import express from 'express';
import authController from '../controller/authController';
import multer from 'multer';
import userController from '../controller/userController';

const userRouter = express.Router();
const authorize = new authController();
const userControl = new userController();

userRouter.post('/signup', authorize.signUp);
userRouter.post('/login', authorize.logIn);
userRouter.post('/forgotPassword', authorize.forgotPassword);
userRouter.patch(
  '/updatepassword',
  authorize.protect,
  authorize.updatePassword
);
userRouter.patch('/resetPassword/:token/:userId', authorize.resetPassword);
userRouter.use(authorize.protect);
userRouter
  .route('/getAllUser')
  .get(authorize.accessRoleIs('ADMIN'), userControl.getAllUsers);
userRouter
  .route('/userInfo')
  .get( userControl.getUser)
  .patch(userControl.uploadUserPhoto,userControl.resizePhoto,userControl.updateUser)
  .delete( userControl.deleteUser);

export default userRouter;
