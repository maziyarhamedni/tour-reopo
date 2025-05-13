import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import axios from 'axios';
import OrderService from '../service/orderService';
class orderController {
  shenaseSite: string;
  paymentPrice: number;
  startPayUrl: string;
  service: OrderService;
  paymentUrl: string;
  checkPaymentUrl;
  constructor() {
    this.paymentUrl = process.env.PAYMENT_URL_CONNECTON1!;
    this.startPayUrl = process.env.START_PAY2!;
    this.checkPaymentUrl = process.env.CHECK_PAYMENT3!;
    this.paymentPrice = 0;
    this.service = new OrderService();
    this.shenaseSite = process.env.SITE_PAYMENT_ID!;
  }

  redirectUserToPayment = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const orderId = req.params.orderId;
      const { count } = req.body;
      const order = await this.service.findOrderForUser(orderId);
      if (order) {
        const tourId = order.tourId;
        const price = await this.service.sentTourPrice(tourId);

        if (price) {
          this.paymentPrice = count * price;

          const authority = await this.sendPaymentRequest(order.id);
          if (authority) {
            console.log(authority);
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
      const { Authority, Status } = req.query;
      try {
        const response = await axios.post(
          this.checkPaymentUrl,
          {
            merchant_id: this.shenaseSite,
            amount: this.paymentPrice,
          },
          {
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
            },
          }
        );
  
        const authority = (response.data as { data: { authority: string } }).data
          .authority;
  
        return authority;
      } catch (error) {
        const axiosError = error as { response?: { data: any }; message: string };
        console.error(
          'Error:',
          axiosError.response ? axiosError.response.data : axiosError.message
        );
      }

      

      console.log(Authority, Status, orderId);
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
      const {count} = req.body
      const tourId = req.params.tourId;
      const info = await this.service.createOrder(tourId, userId,count);
      res.status(201).json({
        status: 'success',
        info,
      });
    }
  );

  sendPaymentRequest = async (orderId: string) => {
    try {
      const response = await axios.post(
        this.paymentUrl,
        {
          merchant_id: this.shenaseSite,
          amount: this.paymentPrice,
          callback_url: `http://127.0.0.1:3000/api/v1/order/checkPayment/${orderId}`,
          description: ` buy tour from site tour.com `,
        },
        {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
          },
        }
      );

      const authority = (response.data as { data: { authority: string } }).data
        .authority;

      return authority;
    } catch (error) {
      const axiosError = error as { response?: { data: any }; message: string };
      console.error(
        'Error:',
        axiosError.response ? axiosError.response.data : axiosError.message
      );
    }
  };
}

export default orderController;
