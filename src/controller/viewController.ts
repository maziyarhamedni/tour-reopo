import catchAsync from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import UserQuery from '../repository/userQuery';
import TourQuery from '../repository/tourQuery';
import ReviewQuery from '../repository/reviewQuery';
import { Tour } from '../utils/express';
import AppError from '../utils/AppError';
class viewController {
  tourQuery;
  userQuery;
  reviewQuery;
  constructor() {
    this.tourQuery = new TourQuery();
    this.userQuery = new UserQuery();
    this.reviewQuery = new ReviewQuery();
  }

  getHomePage = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // const tours = await this.tourQuery.getAllTour();
      const title = 'Home Page';
      res.status(200).render('base.pug', { title: title });
    }
  );

  getLoginform = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const title = 'please log your account ';
      res.status(200).render('login', { title: title,});

      // const { email, password } = req.params;

      // const user = await this.userQuery.findUserByEmail(email);
      // if (!user) {
      //   return next(new AppError('dont have user with tath email', 404));
      // }
      // const result = this.userQuery.checkUserPassword(password, user?.password);
      // if (!result) {
      //   return next(new AppError('password is wrong', 404));
      // }

    }
  );
  getTour = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const tour = await this.tourQuery.findTourBySlug(req.params.slug)!;
      const title = 'Over View page';
      // console.log(tour?.reviews)
      if (tour) {
        const reviews = await this.reviewQuery.getAllReviewByTourId(tour.id);

        res
          .status(200)
          .render('tour', { title: title, tour: tour, reviews: reviews });
      } else {
        return next(new AppError('bad request tour dose not exists', 404));
      }
    }
  );

  getOverview = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const title = 'Over View page';
      const tours = await this.tourQuery.getAllTour();
      // console.log(tours)
      res.status(200).render('overview', { title: title, tours: tours });
    }
  );
}

export default viewController;
