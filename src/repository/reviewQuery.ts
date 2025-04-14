import Repository from './repository';
import { ReviewField } from '../utils/express';
class ReviewQuery {
  model: Repository;

  constructor() {
    this.model = new Repository();
  }

  findReviewById = async (id: string) => {
    const review = await this.model.review.findUnique({
      where: {
        id: id,
      },
    });
    return review ? review : false;
  };
  createReview = async (data: ReviewField) => {
    const review = await this.model.review.create({
      data: {
        review: data.review,
        createdAt: new Date(),
        tourId: data.tourId,
        userId: data.userId,
        rating: data.rating,
      },
    });

    const aggregateData = await this.model.review.aggregate({
      _avg: { rating: true },
      where: {
        tourId: data.tourId,
      },
    });

    await this.model.tour.update({
      where: { id: data.tourId },
      data: {
        ratingsAverage: aggregateData._avg.rating!,
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

  getAllReviewByTourId = async (tourId: string) => {
    const reviews = await this.model.review.findMany({
      where: {
        tourId: tourId,
      },
      include: {
        user: true,
      },
    });

    return reviews;
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
