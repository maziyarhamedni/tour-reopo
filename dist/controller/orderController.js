"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const axios_1 = __importDefault(require("axios"));
const orderService_1 = __importDefault(require("../service/orderService"));
class orderController {
    constructor() {
        this.redirectUserToPayment = (0, catchAsync_1.default)(async (req, res, next) => {
            const orderId = req.params.orderId;
            const { count } = req.body;
            const order = await this.service.findOrderForUser(orderId);
            if (order) {
                const tourId = order.tourId;
                const price = await this.service.sentTourPrice(tourId);
                if (price) {
                    this.paymentPrice = count * price;
                    const authority = this.sendPaymentRequest(order.id);
                    if (authority) {
                        res.status(200).json({
                            urlpay: `${this.startPayUrl}${authority}`,
                        });
                    }
                }
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
        this.addTourToMyOrder = (0, catchAsync_1.default)(async (req, res, next) => {
            const user = req.user;
            const tour = req.params.tourId;
            const data = await this.service.createOrder(tour, user.id);
            res.status(201).json({
                status: 'success',
                data,
            });
        });
        this.sendPaymentRequest = async (orderId) => {
            try {
                const response = await axios_1.default.post(this.paymentUrl, {
                    merchant_id: this.shenaseSite,
                    amount: this.paymentPrice,
                    callback_url: `http://127.0.0.1:3000/api/v1/order/${orderId}`,
                    description: ` buy tour from site tour.com `,
                }, {
                    headers: {
                        accept: 'application/json',
                        'content-type': 'application/json',
                    },
                });
                const authority = response.data;
                console.log(authority);
                // return authority;
            }
            catch (error) {
                const axiosError = error;
                console.error('Error:', axiosError.response ? axiosError.response.data : axiosError.message);
            }
        };
        this.startPayUrl = process.env.START_PAY2;
        this.checkPaymentUrl = process.env.CHECK_PAYMENT;
        this.shenaseSite = process.env.SITE_PAYMENT_ID;
        this.paymentPrice = 0;
        this.service = new orderService_1.default();
        this.paymentUrl = process.env.Payment_URL;
    }
}
exports.default = orderController;
