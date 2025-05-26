"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const reviewService_1 = __importDefault(require("../service/reviewService"));
class reviewController {
    constructor() {
        this.service = new reviewService_1.default();
        this.setTourUserIds = (req, res, next) => {
            if (!req.body.tour)
                req.body.tour = req.params.tourId;
            if (!req.body.user)
                req.body.user = req.user.id;
            next();
        };
        this.sendResponse = (statusCode, statusMassege, res, review) => {
            res.status(statusCode).json({
                message: statusMassege,
                review: review,
            });
        };
        this.deleteOne = (0, catchAsync_1.default)(async (req, res, next) => {
            const review = await this.service.deleteReview(req.params.id, req.user);
            if (!review) {
                return next(new AppError_1.default('you cant delete other review', 404));
            }
            this.sendResponse(204, 'review is delete', res, 'reveiw deleted');
        });
        this.updateOne = (0, catchAsync_1.default)(async (req, res, next) => {
            const data = req.body;
            const updatedReview = await this.service.updateReview(data, req.params.id, req.user.id);
            if (!updatedReview) {
                return next(new AppError_1.default('updated Review not exists', 404));
            }
            this.sendResponse(202, 'review updated', res, updatedReview);
        });
        this.createOne = (0, catchAsync_1.default)(async (req, res, next) => {
            const data = req.body;
            data.tourId = req.params.tourId;
            data.userId = req.user.id;
            const newReview = await this.service.createNewReview(data);
            if (!newReview) {
                return next(new AppError_1.default('review dont created maybe you shared your review previous time ', 404));
            }
            this.sendResponse(201, 'tanks for commit your review', res, newReview);
        });
        this.getReview = (0, catchAsync_1.default)(async (req, res, next) => {
            const id = req.params.id;
            const review = await this.service.getOne(id);
            if (!review) {
                return next(new AppError_1.default('there isnot review with this id', 404));
            }
            this.sendResponse(200, 'seccessful', res, review);
        });
        this.getAll = (0, catchAsync_1.default)(async (req, res, next) => {
            const tourId = req.params.tourId;
            const allReviews = await this.service.getAllReview(tourId);
            if (!allReviews)
                return next(new AppError_1.default('there arenot any review in database \n ', 404));
            this.sendResponse(200, 'seccussful', res, allReviews);
        });
    }
}
module.exports = reviewController;
