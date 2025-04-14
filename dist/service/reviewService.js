"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reviewQuery_1 = __importDefault(require("../repository/reviewQuery"));
class ReviewService {
    constructor() {
        this.deleteReview = (id, user) => __awaiter(this, void 0, void 0, function* () {
            const review = yield this.reviewQuery.findReviewById(id);
            if (!review || (user.role != 'ADMIN' && review.userId != user.id)) {
                return false;
            }
            yield this.reviewQuery.deleteReview(id);
            return review;
        });
        this.updateReview = (data, reviewId, userId) => __awaiter(this, void 0, void 0, function* () {
            const review = yield this.reviewQuery.findReviewById(reviewId);
            if (!review || review.userId != userId)
                return false;
            yield this.reviewQuery.updateReview(reviewId, data);
            const updatedReview = yield this.reviewQuery.findReviewById(reviewId);
            return updatedReview;
        });
        this.createNewReview = (data) => __awaiter(this, void 0, void 0, function* () {
            const newReview = yield this.reviewQuery.createReview(data);
            if (!newReview) {
                return false;
            }
            return newReview;
        });
        this.getOne = (reviewId) => __awaiter(this, void 0, void 0, function* () {
            const review = yield this.reviewQuery.findReviewById(reviewId);
            if (!review) {
                return false;
            }
            return review;
        });
        this.getAllReview = (tourId) => __awaiter(this, void 0, void 0, function* () {
            const allReviews = yield this.reviewQuery.getAllReview(tourId);
            if (!allReviews)
                return false;
            return allReviews;
        });
        this.reviewQuery = new reviewQuery_1.default();
    }
}
exports.default = ReviewService;
