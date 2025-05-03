import express from 'express';
import viewController from '../controller/viewController';
import authController from '../controller/authController';
import orderController from '../controller/orderController';

const viewRouter = express.Router();
const authorize = new authController()
const viewControl = new viewController();
const orderControl  = new orderController()
// viewRouter.use(authorize.isLoggedIn)

viewRouter.get('/',authorize.isLoggedIn, viewControl.getOverview);

viewRouter.get(
  '/tour/:id',authorize.isLoggedIn,viewControl.getTour
);
viewRouter.get('/login',authorize.isLoggedIn,viewControl.getLoginform)
viewRouter.get('/payment/:tourId/:userId/:count',authorize.protect,viewControl.getAccount)



export default viewRouter;