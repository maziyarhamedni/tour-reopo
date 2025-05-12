import express from 'express';
import authController from '../controller/authController';
import orderController from '../controller/orderController';
const orderControl = new orderController()
const orderRouter = express.Router();
const authorize = new authController();

orderRouter
  .route('/buy/:tourId')
  .post(authorize.protect, orderControl.redirectUserToPayment);


  orderRouter
  .route('/addtomyorder/:tourId')
  .post(authorize.protect, orderControl.addTourToMyOrder);

  

orderRouter
  .route('/:userId')
  .get(authorize.protect, orderControl.getOrderByUserId);

export default orderRouter;
