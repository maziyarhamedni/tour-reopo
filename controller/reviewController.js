"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const reviewQuery_1 = __importDefault(require("../repository/reviewQuery"));
class reviewController {
    constructor() {
        this.model = new reviewQuery_1.default();
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
            const review = await this.model.findReviewById(req.params.id);
            if (!review ||
                (req.user.role != 'ADMIN' && review.userId != req.user.id)) {
                return next(new AppError_1.default('you cant delete other review', 404));
            }
            await this.model.deleteReview(req.params.id);
            this.sendResponse(204, 'review updated', res, 'reveiw is deleted');
        });
        this.updateOne = (0, catchAsync_1.default)(async (req, res, next) => {
            const data = req.body;
            const review = await this.model.findReviewById(req.params.id);
            if (!review || review.userId != req.user.id) {
                return next(new AppError_1.default('you cant chenge other user review', 404));
            }
            await this.model.updateReview(req.params.id, data);
            const updatedReview = await this.model.findReviewById(req.params.id);
            this.sendResponse(202, 'review updated', res, updatedReview);
        });
        this.createOne = (0, catchAsync_1.default)(async (req, res, next) => {
            const data = req.body;
            data.tourId = req.params.tourId;
            data.userId = req.user.id;
            const newReview = await this.model.createReview(data);
            if (!newReview) {
                return next(new AppError_1.default('review dont created', 404));
            }
            this.sendResponse(201, 'tanks for commit your review', res, newReview);
        });
        this.getOne = (0, catchAsync_1.default)(async (req, res, next) => {
            const review = await this.model.findReviewById(req.params.id);
            if (!review)
                return next(new AppError_1.default('we dont have review with this id \n id is worng ', 404));
            this.sendResponse(200, 'seccussful', res, review);
        });
        this.getAll = (0, catchAsync_1.default)(async (req, res, next) => {
            const tourId = req.params.tourId;
            console.log(tourId);
            const allReviews = await this.model.getAllReview(tourId);
            if (!allReviews)
                return next(new AppError_1.default('there arenot any review in database \n ', 404));
            this.sendResponse(200, 'seccussful', res, allReviews);
        }
        // To allow for nested GET reviews on tour (hack)
        // SEND RESPONSE
        );
    }
}
module.exports = reviewController;
