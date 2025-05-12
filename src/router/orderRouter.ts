import express from 'express';
import authController from '../controller/authController';
import orderController from '../controller/orderController';
const orderControl = new orderController()
const orderRouter = express.Router();
const authorize = new authController();

orderRouter
  .route('/buy/:orderId')
  .post(authorize.protect, orderControl.redirectUserToPayment);


orderRouter
.route('/checkPayment/:orderId').get(
  orderControl.checkPayment
)

  orderRouter
  .route('/addtomyorder/:tourId')
  .post(authorize.protect, orderControl.addToMyOrder);

  

orderRouter
  .route('/myorder')
  .get(authorize.protect, orderControl.getOrderByUserId);

export default orderRouter;
