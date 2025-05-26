"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = __importDefault(require("./repository"));
class ReviewQuery extends repository_1.default {
    constructor() {
        super();
        this.findReviewById = async (id) => {
            const review = await this.review.findUnique({
                where: {
                    id: id,
                },
            });
            return review ? review : false;
        };
        this.createReview = async (data) => {
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
                    ratingsAverage: aggregateData._avg.rating,
                },
            });
            return review;
        };
        this.updateReview = async (id, data) => {
            await this.review.update({
                where: {
                    id: id,
                },
                data,
            });
        };
        this.getAllReview = async (tourId) => {
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
        this.getAllReviewByTourId = async (tourId) => {
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
        this.deleteReview = async (id) => {
            await this.review.delete({
                where: {
                    id: id,
                },
            });
            return true;
        };
    }
}
exports.default = ReviewQuery;
