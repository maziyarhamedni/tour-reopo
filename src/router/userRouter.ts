import express from 'express';
import authController from '../controller/authController';
import multer from 'multer';
import userController from '../controller/userController';

const upload = multer({ dest: 'public/imag/users' });
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
  .route('/')
  .get(authorize.authorizeAdmin('ADMIN'), userControl.getAllUsers);
userRouter
  .route('/:id')
  .get(authorize.authorizeAdmin('ADMIN', 'USER'), userControl.getUser)
  .patch(upload.single('photo'), userControl.updateUser)
  .delete(authorize.authorizeAdmin('ADMIN', 'USER'), userControl.deleteUser);

export default userRouter;
