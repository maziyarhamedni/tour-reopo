import express from 'express';
import authController from '../controller/authController';
import multer from 'multer'


const upload = multer({dest:'public/imag/users'})
const userRouter = express.Router();
const authorize = new authController();

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
  .get(authorize.authorizeAdmin('ADMIN'), authorize.getAllUsers);
userRouter
  .route('/:id')
  .get(authorize.authorizeAdmin('ADMIN', 'USER'), authorize.getUser)
  .patch(upload.single('photo'), authorize.updateUser)
  .delete(authorize.authorizeAdmin('ADMIN', 'USER'), authorize.deleteUser);

export default userRouter;
