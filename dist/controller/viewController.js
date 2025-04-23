"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const userQuery_1 = __importDefault(require("../repository/userQuery"));
const tourQuery_1 = __importDefault(require("../repository/tourQuery"));
const reviewQuery_1 = __importDefault(require("../repository/reviewQuery"));
const AppError_1 = __importDefault(require("../utils/AppError"));
class viewController {
    constructor() {
        this.getLoginform = (0, catchAsync_1.default)(async (req, res, next) => {
            const title = 'please log your account ';
            res.status(200).render('login', { title: title });
        });
        this.getTour = (0, catchAsync_1.default)(async (req, res, next) => {
            const tour = await this.tourQuery.findTourByName(req.params.slug);
            const title = 'Over View page';
            // console.log(tour?.reviews)
            if (tour) {
                const reviews = await this.reviewQuery.getAllReviewByTourId(tour.id);
                res
                    .status(200)
                    .render('tour', { title: title, tour: tour, reviews: reviews });
            }
            else {
                return next(new AppError_1.default('bad request tour dose not exists', 404));
            }
        });
        this.getOverview = (0, catchAsync_1.default)(async (req, res, next) => {
            const title = 'Over View page';
            const tours = await this.tourQuery.getAllTour();
            res.status(200).render('overview', { title: title, tours: tours });
        });
        this.tourQuery = new tourQuery_1.default();
        this.userQuery = new userQuery_1.default();
        this.reviewQuery = new reviewQuery_1.default();
    }
}
exports.default = viewController;
