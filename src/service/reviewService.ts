import ReviewQuery from '../repository/reviewQuery';
import { NewUser } from '../utils/express';
import { ReviewField } from '../utils/express';

class ReviewService {
  reviewQuery;
  constructor() {
    this.reviewQuery = new ReviewQuery();
  }
  deleteReview = async (id: string, user: NewUser) => {
    const review = await this.reviewQuery.findReviewById(id);
    if (!review || (user.role != 'ADMIN' && review.userId != user.id)) {
      return false;
    }
    await this.reviewQuery.deleteReview(id);
    return review;
  };
  updateReview = async (
    data: ReviewField,
    reviewId: string,
    userId: string
  ) => {
    const review = await this.reviewQuery.findReviewById(reviewId);

    if (!review || review.userId != userId) return false;

    await this.reviewQuery.updateReview(reviewId, data);
    const updatedReview = await this.reviewQuery.findReviewById(reviewId);
    return updatedReview;
  };

  createNewReview = async (data: ReviewField) => {
    const newReview = await this.reviewQuery.createReview(data);
    if (!newReview) {
      return false;
    }
    return newReview;
  };

  getOne = async (reviewId: string) => {
    const review = await this.reviewQuery.findReviewById(reviewId)
    if (!review) {return false;}
    return review;
  };

  getAllReview = async (tourId: string) => {
    const allReviews = await this.reviewQuery.getAllReview(tourId);

    if (!allReviews) return false;
    return allReviews;
  };
}
export default ReviewService;
