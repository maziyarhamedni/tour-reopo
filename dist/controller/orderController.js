"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const axios_1 = __importDefault(require("axios"));
const orderService_1 = __importDefault(require("../service/orderService"));
const AppError_1 = __importDefault(require("../utils/AppError"));
class orderController {
    constructor() {
        this.redirectUserToPayment = (0, catchAsync_1.default)(async (req, res, next) => {
            const orderId = req.params.orderId;
            const order = await this.service.getOrderById(orderId);
            if (order) {
                const tourId = order.tourId;
                const price = await this.service.sentTourPrice(tourId);
                if (price) {
                    this.paymentPrice = order.finalPrice;
                    const authority = await this.sendPaymentRequest(order.id);
                    if (authority) {
                        res.status(200).json({
                            urlpay: `${this.startPayUrl}${authority}`,
                        });
                    }
                }
            }
        });
        this.checkPayment = (0, catchAsync_1.default)(async (req, res, next) => {
            const orderId = req.params.orderId;
            const order = await this.service.getOrderById(orderId);
            if (!order) {
                return next(new AppError_1.default('order not exists', 401));
            }
            const { Authority } = req.query;
            const orderPrice = order.finalPrice;
            console.log(order, Authority);
            try {
                const response = await axios_1.default.post(this.checkPaymentUrl, {
                    merchant_id: this.shenaseSite,
                    amount: orderPrice,
                    authority: Authority,
                }, {
                    headers: {
                        accept: 'application/json',
                        'content-type': 'application/json',
                    },
                });
                const data = await response.data;
                console.log(data);
            }
            catch (error) {
                const axiosError = error;
                console.error('Error:', axiosError.response ? axiosError.response.data : axiosError.message);
            }
        });
        this.getOrderByUserId = (0, catchAsync_1.default)(async (req, res, next) => {
            const userId = req.user.id;
            const orders = await this.service.getOrderbyUserId(userId);
            if (orders) {
                res.status(200).json(orders);
            }
            else {
                res.status(200).json({ order: [] });
            }
        });
        this.addToMyOrder = (0, catchAsync_1.default)(async (req, res, next) => {
            const userId = req.user.id;
            const { count } = req.body;
            const tourId = req.params.tourId;
            const info = await this.service.createOrder(tourId, userId, count);
            res.status(201).json({
                status: 'success',
                info,
            });
        });
        this.sendPaymentRequest = async (orderId) => {
            try {
                const response = await axios_1.default.post(this.paymentUrl, {
                    merchant_id: this.shenaseSite,
                    amount: this.paymentPrice,
                    callback_url: `http://127.0.0.1:3000/api/v1/order/checkPayment/${orderId}`,
                    description: ` buy tour from site tour.com `,
                }, {
                    headers: {
                        accept: 'application/json',
                        'content-type': 'application/json',
                    },
                });
                const authority = response.data.data
                    .authority;
                return authority;
            }
            catch (error) {
                const axiosError = error;
                console.error('Error:', axiosError.response ? axiosError.response.data : axiosError.message);
            }
        };
        this.paymentUrl = process.env.PAYMENT_URL_CONNECTON1;
        this.startPayUrl = process.env.START_PAY2;
        this.checkPaymentUrl = process.env.CHECK_PAYMENT3;
        this.paymentPrice = 0;
        this.service = new orderService_1.default();
        this.shenaseSite = process.env.SITE_PAYMENT_ID;
    }
}
exports.default = orderController;
