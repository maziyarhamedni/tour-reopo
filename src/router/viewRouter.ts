import express from 'express';
import viewController from '../controller/viewController';
import authController from '../controller/authController';

const viewRouter = express.Router();
const authorize = new authController()
const viewControl = new viewController;
// viewRouter.use(authorize.isLoggedIn)

viewRouter.get('/',authorize.isLoggedIn, viewControl.getOverview);

viewRouter.get(
  '/tour/:id',authorize.isLoggedIn,viewControl.getTour
);
viewRouter.get('/login',authorize.isLoggedIn,viewControl.getLoginform)



export default viewRouter;