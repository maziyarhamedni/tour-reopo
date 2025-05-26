import Repository from './repository';
import { ReviewField } from '../utils/express';
class ReviewQuery extends Repository {
 

  constructor() {
    super()
  }

  findReviewById = async (id: string) => {
    const review = await this.review.findUnique({
      where: {
        id: id,
      },
    });
    return review ? review : false;
  };
  createReview = async (data: ReviewField) => {
    
    const review = await this.review.create({
      data: {
        review: data.review,
        createdAt: new Date(),
        tourId: data.tourId,
        userId: data.userId,
        rating: data.rating,
      },
    });

    const aggregateData = await this.review.aggregate({
      _avg: { rating: true },
      where: {
        tourId: data.tourId,
      },
    });

    await this.tour.update({
      where: { id: data.tourId },
      data: {
        ratingsAverage: aggregateData._avg.rating!,
      },
    });
    return review;
  };

  updateReview = async (id: string, data: any) => {
    await this.review.update({
      where: {
        id: id,
      },
      data,
    });
  };

  getAllReview = async (tourId: string) => {
    const allReviews = await this.tour.findUnique({
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
    const reviews = await this.review.findMany({
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
    await this.review.delete({
      where: {
        id: id,
      },
    });

    return true;
  };
}

export default ReviewQuery;
