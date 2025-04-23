import catchAsync from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import UserQuery from '../repository/userQuery';
import TourQuery from '../repository/tourQuery';
import ReviewQuery from '../repository/reviewQuery';

class viewController {
  tourQuery;
  userQuery;
  reviewQuery;
  constructor() {
    this.tourQuery = new TourQuery();
    this.userQuery = new UserQuery();
    this.reviewQuery = new ReviewQuery();
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

  getOverview = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const title = 'Over View page';
      const tours = await this.tourQuery.getAllTour();
      res.status(200).render('overview', { title: title, tours: tours });
    }
  );
}

export default viewController;
