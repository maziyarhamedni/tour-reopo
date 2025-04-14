import { NextFunction, Request, Response } from 'express';
import TourQuery from '../repository/tourQuery';
import AppError from '../utils/AppError';
import TourService from '../service/tourService';
import catchAsync from '../utils/catchAsync';

class TourController {
  service;
  constructor() {
    this.service = new TourService();
  }
  getAllTours = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const tours = await this.service.getAllTours();
      if (!tours) {
        return next(new AppError('crush an api and cant get all tour', 404));
      }
      res.status(200).json(tours);
    }
  );

  createTour = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await req.body;
      const tour = await this.service.createTour(data);
      if (!tour) {
        return next(new AppError('cant make a tour to database', 403));
      }
      res.status(201).json(tour);
    }
  );

  getTour = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id;
      const tour = await this.service.getTour(id);
      if (!tour) {
        return next(new AppError('please inter id of tour', 404));
      }
      res.status(200).json(tour);
    }
  );

  updateTour = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id;
      const data = req.body;
      const updateTour = this.service.updateTour(id, data);

      if (!updateTour) {
        return next(new AppError('thers isnot tour whit this id', 404));
      }
      res.status(200).json(updateTour);
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
      const newStartLoc = await this.service.addStartLoc(id, data)!;

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
      const newLoc = await this.service.addLoc(id, data)!;

      if (!newLoc) {
        return next(new AppError('please inter start location', 404));
      }

      res.status(201).json(newLoc);
    }
  );

  // tourWhitn = catchAsync(
  //   async (req: Request, res: Response, next: NextFunction) => {
  //     const { distance, latlng, unit } = req.params;

  //     const [lat, lng] = latlng.split(',');
  //     if (!lat || !lng) {
  //       next(
  //         new AppError(
  //           'please provide latiutr and logitude in th format lat,len',
  //           400
  //         )
  //       );
  //     }

  //     const disNum = Number(distance);
  //     const newLat = Number(lat);
  //     const newLng = Number(lng);
  //     const radius = unit == 'mi' ? disNum / 3963.2 : disNum / 6378.1;
  //     const tours = await this.query.tourWhiten(radius, newLat, newLng);

  //     res.status(200).json({
  //       status: 'success',
  //       tours
  //     });
  //   }
  // );
  addTourGuides = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id;
      const guides = req.body.guides;
      const guide = await this.service.addTourGuides(id, guides);

      if (!guide) {
        return next(new AppError('shit', 404));
      }
      res.status(201).json(guide);
    }
  );
}

export default TourController;
