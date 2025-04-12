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
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const userQuery_1 = __importDefault(require("../repository/userQuery"));
const tourQuery_1 = __importDefault(require("../repository/tourQuery"));
const reviewQuery_1 = __importDefault(require("../repository/reviewQuery"));
const AppError_1 = __importDefault(require("../utils/AppError"));
class viewController {
    constructor() {
        this.getHomePage = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // const tours = await this.tourQuery.getAllTour();
            const title = 'Home Page';
            res.status(200).render('base.pug', { title: title });
        }));
        this.getLoginform = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const title = 'please log your account ';
            res.status(200).render('login', { title: title, });
            // const { email, password } = req.params;
            // const user = await this.userQuery.findUserByEmail(email);
            // if (!user) {
            //   return next(new AppError('dont have user with tath email', 404));
            // }
            // const result = this.userQuery.checkUserPassword(password, user?.password);
            // if (!result) {
            //   return next(new AppError('password is wrong', 404));
            // }
        }));
        this.getTour = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const tour = yield this.tourQuery.findTourByName(req.params.slug);
            const title = 'Over View page';
            // console.log(tour?.reviews)
            if (tour) {
                const reviews = yield this.reviewQuery.getAllReviewByTourId(tour.id);
                res
                    .status(200)
                    .render('tour', { title: title, tour: tour, reviews: reviews });
            }
            else {
                return next(new AppError_1.default('bad request tour dose not exists', 404));
            }
        }));
        this.getOverview = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const title = 'Over View page';
            const tours = yield this.tourQuery.getAllTour();
            // console.log(tours)
            res.status(200).render('overview', { title: title, tours: tours });
        }));
        this.tourQuery = new tourQuery_1.default();
        this.userQuery = new userQuery_1.default();
        this.reviewQuery = new reviewQuery_1.default();
    }
}
exports.default = viewController;
