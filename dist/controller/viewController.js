"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const userQuery_1 = __importDefault(require("../repository/userQuery"));
const tourQuery_1 = __importDefault(require("../repository/tourQuery"));
const reviewQuery_1 = __importDefault(require("../repository/reviewQuery"));
const axios_1 = __importDefault(require("axios"));
class viewController {
    constructor() {
        this.getLoginform = (0, catchAsync_1.default)(async (req, res, next) => {
            const title = 'please log your account ';
            res.status(200).render('login', { title: title });
        });
        this.getTour = (0, catchAsync_1.default)(async (req, res, next) => {
            const tour = await this.tourQuery.findTourById(req.params.id);
            const title = 'Over View page';
            if (tour) {
                const reviews = await this.reviewQuery.getAllReviewByTourId(tour.id);
                res
                    .status(200)
                    .render('tour', { title: title, tour: tour, reviews: reviews });
            }
        });
        this.paymentResult = (0, catchAsync_1.default)(async (req, res, next) => {
            const authoraity = req.query.Authority;
            const status = req.query.Status;
            const { count, tourId, userId } = req.params;
            let result;
            try {
                const response = await axios_1.default.post('https://sandbox.zarinpal.com/pg/v4/payment/verify.json', {
                    merchant_id: this.shenaseSite,
                    amount: count,
                    authority: authoraity,
                }, {
                    headers: {
                        accept: 'application/json',
                        'content-type': 'application/json',
                    },
                });
                result = response.data;
            }
            catch (error) {
                const axiosError = error;
                console.error('Error:', axiosError.response ? axiosError.response.data : axiosError.message);
            }
            // console.log(result);
            if ((result === null || result === void 0 ? void 0 : result.data.code) == 100 || (result === null || result === void 0 ? void 0 : result.data.code) == 101) {
                res.status(200).render('payment', { result: result });
                console.log(result.data.code);
                /// now i must create order in db
            }
            else {
                res.status(200).render('payment', { result: result === null || result === void 0 ? void 0 : result.data.message });
                // console.log(result)
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
        this.shenaseSite = process.env.SITE_PAYMENT_ID;
    }
}
exports.default = viewController;
