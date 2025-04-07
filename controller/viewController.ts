import catchAsync from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import UserQuery from '../repository/userQuery';
import TourQuery from '../repository/tourQuery';

class viewController {
  tourQuery;
  userQuery;
  constructor() {
    this.tourQuery = new TourQuery();
    this.userQuery = new UserQuery();
  }

  getHomePage = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // const tours = await this.tourQuery.getAllTour();
      const title = 'Home Page';
      res.status(200).render('base', { title:title });
    }
  );

  getTour = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const title = 'Over View page';
      res.status(200).render('tour', { title:title });
    }
  );


  getOverview= catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const title = 'Over View page';
      const tours = await this.tourQuery.getAllTour()
      // console.log(tours)
      res.status(200).render('overview', { title:title,tours:tours });
    }
  );
}

export default viewController;
