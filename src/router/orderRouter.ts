import express from 'express';
import authController from '../controller/authController';
import orderController from '../controller/orderController';
const orderControl = new orderController()
const orderRouter = express.Router();
const authorize = new authController();

orderRouter
  .route('/:tourId')
  .post(authorize.protect, orderControl.redirectUserToPayment);
orderRouter
  .route('/check-payment')
  .post(authorize.protect, orderControl.checkPaymentResult)
 
export default orderRouter;
