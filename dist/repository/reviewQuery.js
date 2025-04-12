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
const reviewModel_1 = __importDefault(require("./../models/reviewModel"));
class ReviewQuery {
    constructor() {
        this.findReviewById = (id) => __awaiter(this, void 0, void 0, function* () {
            const review = yield this.model.review.findUnique({
                where: {
                    id: id,
                },
            });
            if (review) {
                return review;
            }
        });
        this.createReview = (data) => __awaiter(this, void 0, void 0, function* () {
            console.log(data);
            const review = yield this.model.review.create({
                data: {
                    review: data.review,
                    createdAt: new Date(),
                    tourId: data.tourId,
                    userId: data.userId,
                    rating: data.rating,
                },
            });
            const aggregateData = yield this.model.review.aggregate({
                _avg: { rating: true },
                where: {
                    tourId: data.tourId,
                },
            });
            yield this.model.tour.update({
                where: { id: data.tourId },
                data: {
                    ratingsAverage: aggregateData._avg.rating
                }
            });
            return review;
        });
        this.updateReview = (id, data) => __awaiter(this, void 0, void 0, function* () {
            yield this.model.review.update({
                where: {
                    id: id,
                },
                data,
            });
        });
        this.getAllReview = (tourId) => __awaiter(this, void 0, void 0, function* () {
            const allReviews = yield this.model.tour.findUnique({
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
        });
        this.getAllReviewByTourId = (tourId) => __awaiter(this, void 0, void 0, function* () {
            const reviews = yield this.model.review.findMany({
                where: {
                    tourId: tourId
                },
                include: {
                    user: true,
                }
            });
            return reviews;
        });
        this.deleteReview = (id) => __awaiter(this, void 0, void 0, function* () {
            yield this.model.review.delete({
                where: {
                    id: id,
                },
            });
            return true;
        });
        this.model = new reviewModel_1.default();
    }
}
exports.default = ReviewQuery;
