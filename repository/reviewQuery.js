"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reviewModel_1 = __importDefault(require("./../models/reviewModel"));
class ReviewQuery {
    constructor() {
        this.findReviewById = async (id) => {
            const review = await this.model.review.findUnique({
                where: {
                    id: id,
                },
            });
            if (review) {
                return review;
            }
        };
        this.createReview = async (data) => {
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
            const aggregateData = await this.model.review.aggregate({
                _avg: { rating: true },
                where: {
                    tourId: data.tourId,
                },
            });
            await this.model.tour.update({
                where: { id: data.tourId },
                data: {
                    ratingsAverage: aggregateData._avg.rating
                }
            });
            return review;
        };
        this.updateReview = async (id, data) => {
            await this.model.review.update({
                where: {
                    id: id,
                },
                data,
            });
        };
        this.getAllReview = async (tourId) => {
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
        this.deleteReview = async (id) => {
            await this.model.review.delete({
                where: {
                    id: id,
                },
            });
            return true;
        };
        this.model = new reviewModel_1.default();
    }
}
exports.default = ReviewQuery;
