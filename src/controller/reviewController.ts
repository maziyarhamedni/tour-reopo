import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import { ReviewField } from '../utils/express';
import ReviewService from '../service/reviewService';

class reviewController {
  private service: ReviewService = new ReviewService();

  setTourUserIds = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
  };

  sendResponse = (
    statusCode: number,
    statusMassege: string,
    res: Response,
    review: ReviewField | any
  ) => {
    res.status(statusCode).json({
      message: statusMassege,
      review: review,
    });
  };

  deleteOne = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const review = await this.service.deleteReview(req.params.id, req.user);
      if (!review) {
        return next(new AppError('you cant delete other review', 404));
      }

      this.sendResponse(204, 'review is delete', res, review);
    }
  );

  updateOne = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const data: ReviewField = req.body;
      const updatedReview = await this.service.updateReview(
        data,
        req.params.id,
        req.user.id
      );
      if (!updatedReview) {
        return next(new AppError('updated Review not exists', 404));
      }
      this.sendResponse(202, 'review updated', res, updatedReview);
    }
  );

  createOne = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const data: ReviewField = req.body;
      data.tourId = req.params.tourId;
      data.userId = req.user.id;
      const newReview = await this.service.createNewReview(data);
      if (!newReview) {
        return next(
          new AppError(
            'review dont created maybe you shared your review previous time ',
            404
          )
        );
      }
      this.sendResponse(201, 'tanks for commit your review', res, newReview);
    }
  );

  getReview = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id;
      const review = await this.service.getOne(id);
      if (!review) {
        return next(new AppError('there isnot review with this is', 404));
      }
      this.sendResponse(200, 'seccessful', res, review);
    }
  );

  getAll = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const tourId = req.params.tourId;

      const allReviews = await this.service.getAllReview(tourId);
      if (!allReviews)
        return next(
          new AppError('there arenot any review in database \n ', 404)
        );
      this.sendResponse(200, 'seccussful', res, allReviews);
    }
  );
}

export = reviewController;
