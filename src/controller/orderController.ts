import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import axios from 'axios';
import OrderService from '../service/orderService';
import AppError from '../utils/AppError';
class orderController {
  shenaseSite: string;
  paymentPrice: number;
  paymentUrl: string;
  checkPaymentUrl: string;
  service: OrderService;
  startPayUrl: string;
  constructor() {
    this.startPayUrl = process.env.START_PAY2!;
    this.paymentPrice = 0;
    this.service = new OrderService();
    this.shenaseSite = process.env.SITE_PAYMENT_ID!;
    this.paymentUrl = process.env.PAYMENT_URL_CONNECTON1!;
    this.checkPaymentUrl = process.env.CHECK_PAYMENT3!;
  }

  redirectUserToPayment = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const orderId = req.params.orderId;

      const order = await this.service.getOrderById(orderId);
      if (order) {
        const tourId = order.tourId;
        const price = await this.service.sentTourPrice(tourId);

        if (price) {
          this.paymentPrice = order.finalPrice;
          const authority = await this.sendPaymentRequest(order.id);
          if (authority) {
            res.status(200).json({
              urlpay: `${this.startPayUrl}${authority}`,
            });
          }
        }
      }
    }
  );

  checkPayment = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const orderId = req.params.orderId;
      const order = await this.service.getOrderById(orderId);
      if (!order) {
        return next(new AppError('order not exists', 401));
      }
      const { Authority } = req.query;
      let data;
      if (typeof Authority == 'string') {
        const response: any = await this.service.connctionWithZainPal(
          this.checkPaymentUrl,
          {
            merchant_id: this.shenaseSite,
            amount: order.finalPrice,
            authority: Authority,
          }
        );
        data = await response.data;
      }

      ///////////////                now i must add this to prisma
      //////////////                  and seprate axios requsets sfe
      /////////////                    and add trx to database to save
      ////////////                      and user transaction on database

      if (data.code == 100) {
        data.order_id = orderId;
        const trx = await this.service.createTrx(data);
        console.log(trx);
      } else if (data.code == 101) {
        const order = await this.service.getOrderById(orderId);
        if (order && order.status == 'pending') {
          data.order_id = orderId;
          const trx = await this.service.createTrx(data);
          res.status(200).json({
            status: 'success',
            trx,
          });
        } else if (order && order.status == 'paid') {
          const trx = await this.service.findTrxbyOrderId(orderId);

          res.status(200).json({
            status: 'success',
            trx,
          });
        }
      }
    }
  );

  getOrderByUserId = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user.id;
      const orders = await this.service.getOrderbyUserId(userId);

      if (orders) {
        res.status(200).json(orders);
      } else {
        res.status(200).json({ order: [] });
      }
    }
  );

  addToMyOrder = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user.id;
      const { count } = req.body;
      const tourId = req.params.tourId;
      const info = await this.service.createOrder(tourId, userId, count);
      res.status(201).json({
        status: 'success',
        info,
      });
    }
  );

  sendPaymentRequest = async (orderId: string) => {
    const response: any = await this.service.connctionWithZainPal(
      this.paymentUrl,
      {
        merchant_id: this.shenaseSite,
        amount: this.paymentPrice,
        callback_url: `http://127.0.0.1:3000/api/v1/order/checkPayment/${orderId}`,
        description: ` buy tour from site tour.com `,
      }
    );

    const authority = response.data.authority;

    return authority || false;
  };
}

export default orderController;
