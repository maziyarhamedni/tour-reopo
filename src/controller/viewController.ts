import catchAsync from '../utils/catchAsync';
import { PaymentResponse } from '../utils/express';
import { Request, Response, NextFunction } from 'express';
import UserQuery from '../repository/userQuery';
import TourQuery from '../repository/tourQuery';
import ReviewQuery from '../repository/reviewQuery';
import axios from 'axios';
import OrderService from '../service/orderService';

class viewController {
  tourQuery;
  orderService: OrderService;
  userQuery;
  reviewQuery;
  shenaseSite: string;
  constructor() {
    this.tourQuery = new TourQuery();
    this.userQuery = new UserQuery();
    this.reviewQuery = new ReviewQuery();
    this.orderService = new OrderService();
    this.shenaseSite = process.env.SITE_PAYMENT_ID!;
  }

  getLoginform = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const title = 'please log your account ';
      res.status(200).render('login', { title: title });
    }
  );
  getTour = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const tour = await this.tourQuery.findTourById(req.params.id);

      const title = 'tour page';
      if (tour) {
        const reviews = await this.reviewQuery.getAllReviewByTourId(tour.id);
        res
          .status(200)
          .render('tour', { title: title, tour: tour, reviews: reviews });
      }
    }
  );

  paymentResult = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const authoraity = req.query.Authority;
      const status = req.query.Status;
      const { count, tourId, userId } = req.params;
      const numPrice = parseInt(count);

      let result;
      try {
        const response = await axios.post<PaymentResponse>(
          'https://sandbox.zarinpal.com/pg/v4/payment/verify.json',
          {
            merchant_id: this.shenaseSite,
            amount: count,
            authority: authoraity,
          },
          {
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
            },
          }
        );

        result = response.data;
      } catch (error) {
        const axiosError = error as {
          response?: { data: PaymentResponse };
          message: string;
        };
        console.error(
          'Error:',
          axiosError.response ? axiosError.response.data : axiosError.message
        );
      }

      if (result?.data.code == 100) {
        const order = await this.orderService.createOrder(
          tourId,
          userId
        );
     

        res.status(200).render('payment', { result: order });
      } else {
        const reviews = await this.reviewQuery.getAllReviewByTourId(tourId);
        const tour = await this.tourQuery.findTourById(tourId);
        res
          .status(200)
          .render('tour', { title: 'tour page', tour: tour, reviews: reviews });
       
      }
    }
  );
  getOverview = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const tours = await this.tourQuery.getAllTour();
      res.status(200).render('overview', { title: 'main page', tours: tours });
    }
  );
}

export default viewController;
