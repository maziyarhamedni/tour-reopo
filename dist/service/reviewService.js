"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reviewQuery_1 = __importDefault(require("../repository/reviewQuery"));
class ReviewService {
    constructor() {
        this.deleteReview = async (id, user) => {
            const review = await this.reviewQuery.findReviewById(id);
            if (!review || (user.role != 'ADMIN' && review.userId != user.id)) {
                return false;
            }
            await this.reviewQuery.deleteReview(id);
            return review;
        };
        this.updateReview = async (data, reviewId, userId) => {
            const review = await this.reviewQuery.findReviewById(reviewId);
            if (!review || review.userId != userId)
                return false;
            await this.reviewQuery.updateReview(reviewId, data);
            const updatedReview = await this.reviewQuery.findReviewById(reviewId);
            return updatedReview;
        };
        this.createNewReview = async (data) => {
            const newReview = await this.reviewQuery.createReview(data);
            if (!newReview) {
                return false;
            }
            return newReview;
        };
        this.getOne = async (reviewId) => {
            const review = await this.reviewQuery.findReviewById(reviewId);
            if (!review) {
                return false;
            }
            return review;
        };
        this.getAllReview = async (tourId) => {
            const allReviews = await this.reviewQuery.getAllReview(tourId);
            if (!allReviews)
                return false;
            return allReviews;
        };
        this.reviewQuery = new reviewQuery_1.default();
    }
}
exports.default = ReviewService;
