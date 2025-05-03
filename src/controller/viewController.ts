import catchAsync from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import UserQuery from '../repository/userQuery';
import TourQuery from '../repository/tourQuery';
import ReviewQuery from '../repository/reviewQuery';
import axios from 'axios';
// import { response } from 'src/app';

class viewController {
  tourQuery;
  userQuery;
  reviewQuery;
  shenaseSite: string;
  constructor() {
    this.tourQuery = new TourQuery();
    this.userQuery = new UserQuery();
    this.reviewQuery = new ReviewQuery();
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

      const title = 'Over View page';
      if (tour) {
        const reviews = await this.reviewQuery.getAllReviewByTourId(tour.id);
        res
          .status(200)
          .render('tour', { title: title, tour: tour, reviews: reviews });
      }
    }
  );
  getAccount = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const authoraity = req.query.Authority;
      const status = req.query.Status;
      const { count, tourId, userId } = req.params;
      let result;
      try {
        const response = await axios.post(
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

        result = response;
        console.log(result.data);
      } catch (error) {
        const axiosError = error as {
          response?: { data: any };
          message: string;
        };
        console.error(
          'Error:',
          axiosError.response ? axiosError.response.data : axiosError.message
        );
      }

      if (result) {
        res.status(200).render('payment', { result: result.data });
      } else {
        res.status(200).render('payment', { result: 'payment is faild' });
      }
    }
  );
  getOverview = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const title = 'Over View page';
      const tours = await this.tourQuery.getAllTour();
      res.status(200).render('overview', { title: title, tours: tours });
    }
  );
}

export default viewController;
