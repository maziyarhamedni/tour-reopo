import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import open, { apps } from 'open';
import axios from 'axios';
import OrderService from '../service/orderService';

class orderController {
  shenaseSite: string;
  price: number;
  count :number;
  service:OrderService

  constructor() {
    this.shenaseSite = process.env.SITE_PAYMENT_ID!;
    this.price = 0;
    this.count = 0
    this.service = new OrderService()
  }

  redirectUserToPayment = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { price, count } = req.body;
      const tourId = req.params.tourId;
      const userId = req.user.id;
      this.count = count;
      this.price = parseInt(String(price * count));
      await this.sendPaymentRequest(tourId, userId);
      res.send('payment page is loding...')

    }
  );



 


  sendPaymentRequest = async (tourId: string, userId: string) => {
    try {
      const response = await axios.post(
        'https://sandbox.zarinpal.com/pg/v4/payment/request.json',
        {
          merchant_id: this.shenaseSite,
          amount: this.price,
          callback_url: `http://127.0.0.1:3000/payment/${tourId}/${userId}/${this.price}`,
          description: ` buy tour from site tour.com `,
          metadata: {
            userId: `${userId}`,
            tourId: `${tourId}`,
          },
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

      await open(`https://sandbox.zarinpal.com/pg/StartPay/${authority}`, {
        app: {
          name: apps.chrome,
        },
      });
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
