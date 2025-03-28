import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import { ReviewField } from '../utils/express';
import ReviewQuery from '../repository/reviewQuery';

class reviewController {
  private model: ReviewQuery = new ReviewQuery();

  setTourUserIds = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
  };

  sendResponse = (
    statusCode: number,
    statusMassege: string,
    res: Response,
    review: any
  ) => {
    res.status(statusCode).json({
      message: statusMassege,
      review: review,
    });
  };
  deleteOne = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const review = await this.model.findReviewById(req.params.id);

      if (
        !review ||
        (req.user.role != 'ADMIN' && review.userId != req.user.id)
      ) {
        return next(new AppError('you cant delete other review', 404));
      }
      await this.model.deleteReview(req.params.id);

      this.sendResponse(204, 'review updated', res, 'reveiw is deleted');
    }
  );

  updateOne = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const data: ReviewField = req.body;

      const review = await this.model.findReviewById(req.params.id);
      if (!review || review.userId != req.user.id) {
        return next(new AppError('you cant chenge other user review', 404));
      }

      await this.model.updateReview(req.params.id, data);
      const updatedReview = await this.model.findReviewById(req.params.id);
      this.sendResponse(202, 'review updated', res, updatedReview);
    }
  );

  createOne = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const data: ReviewField = req.body;
      data.tourId = req.params.tourId;
      data.userId = req.user.id;
      const newReview = await this.model.createReview(data);
      if (!newReview) {
        return next(new AppError('review dont created', 404));
      }
      this.sendResponse(201, 'tanks for commit your review', res, newReview);
    }
  );

  getOne = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const review = await this.model.findReviewById(req.params.id);

      if (!review)
        return next(
          new AppError('we dont have review with this id \n id is worng ', 404)
        );

      this.sendResponse(200, 'seccussful', res, review);
    }
  );

  getAll = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const tourId = req.params.tourId;
      console.log(tourId);
      const allReviews = await this.model.getAllReview(tourId);
      if (!allReviews)
        return next(
          new AppError('there arenot any review in database \n ', 404)
        );
      this.sendResponse(200, 'seccussful', res, allReviews);
    }
    // To allow for nested GET reviews on tour (hack)
    // SEND RESPONSE
  );
}

export = reviewController;
