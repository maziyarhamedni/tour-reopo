import { NextFunction, Request, Response } from 'express';
import TourQuery from '../repository/tourQuery';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import { StartLocation } from '../utils/express';

class TourController {
  query: TourQuery;
  constructor() {
    this.query = new TourQuery();
  }
  getAllTours = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const tours = await this.query.getAllTour();

      res.status(200).json(tours);
    }
  );

  createTour = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await req.body;
      // console.log('>>>>>>>>>>>>>>>>>>');
      const tour = await this.query.createTour(data);
      if (!tour) {
        return next(new AppError('cant make a tour to database', 403));
      }

      res.status(201).json(tour);
      // next()
    }
  );

  getTour = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id;
      const tour = await this.query.findTourById(id);
      if (!tour) {
        return next(new AppError('please inter id of tour', 404));
      }
      res.status(200).json(tour);
    }
  );

  updateTour = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id;
      if (!id) {
        return next(new AppError('please inter id of tour', 404));
      }
      console.log(id);
      res.json(req.body);
    }
  );

  deleteTour = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id;
      if (!id) {
        return next(new AppError('please inter id of tour', 404));
      }
      res.status(204).send(`tour with id ${id}deleted `);
    }
  );

  addStartLoc = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id;
      const data = req.body;
      data.tourId = id;
      const newStartLoc = await this.query.createStartLocation(data)!;

      if (!newStartLoc) {
        return next(new AppError('please inter start location', 404));
      }

      res.status(201).json(newStartLoc);
    }
  );

  addLoc = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id;
      const data = req.body;
      data.tourId = id;
      const newLoc = await this.query.createLocation(data)!;

      if (!newLoc) {
        return next(new AppError('please inter start location', 404));
      }

      res.status(201).json(newLoc);
    }
  ); 
   
// test commit 
// test 2 commit
  addTourGuides = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id;
      const guides = req.body.guides;
      const guide = await this.query.addTourGuide(id, guides);

      if (!guide) {
        return next(new AppError('shit',404))
      }
      res.status(201).json(guide)
    }
  );
}

export = TourController;
