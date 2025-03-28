import ReviewModel from './../models/reviewModel';
import { ReviewField } from '../utils/express';
import { tour } from '../models/model';
class ReviewQuery {
  model: ReviewModel;

  constructor() {
    this.model = new ReviewModel();
  }

  findReviewById = async (id: string) => {
    const review = await this.model.review.findUnique({
      where: {
        id: id,
      },
    });

    if (review) {
      return review;
    }
  };
  createReview = async (data: ReviewField) => {
    console.log(data);
    const review = await this.model.review.create({
      data: {
        review: data.review,
        createdAt: new Date(),
        tourId: data.tourId,
        userId: data.userId,
        rating: data.rating,
      },
    });
    return review;
  };

  updateReview = async (id: string, data: any) => {
    await this.model.review.update({
      where: {
        id: id,
      },
      data,
    });
  };

  getAllReview = async (tourId: string) => {
    const allReviews = await this.model.tour.findUnique({
      where: {
        id: tourId,
      },

      omit: {
        id: true,
        name: true,
        price: true,
        summary: true,
        difficulty: true,
        description: true,
        ratingsQuantity: true,
        images: true,
        startDates: true,
        imageCover: true,
      },

      include: {
        reviews: {
          omit: {
            tourId: true,
            userId: true,
            id: true,
          },
          include: {
            user: {
              select: {
                name: true,
                lastName: true,
              },
            },
          },
          where: {
            tourId: tourId,
          },
        },
      },
    });

    return allReviews ? allReviews : false;
  };

  deleteReview = async (id: string) => {
    await this.model.review.delete({
      where: {
        id: id,
      },
    });

    return true;
  };
}

export default ReviewQuery;
