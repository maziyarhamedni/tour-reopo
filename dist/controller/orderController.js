"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const orderService_1 = __importDefault(require("../service/orderService"));
const AppError_1 = __importDefault(require("../utils/AppError"));
class orderController {
    constructor() {
        this.snedDatatoUser = (res, StatusCode, data) => {
            res.status(StatusCode).json({ status: 'success', data });
        };
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
            let data;
            if (typeof Authority == 'string') {
                const response = await this.service.connctionWithZainPal(this.checkPaymentUrl, {
                    merchant_id: this.shenaseSite,
                    amount: order.finalPrice,
                    authority: Authority,
                });
                data = await response.data;
                data.order_id = orderId;
            }
            if (data.code == 100) {
                const trx = await this.service.createTrx(data);
                this.snedDatatoUser(res, 200, trx);
            }
            else if (data.code == 101) {
                const result = await this.service.checkCode101ZarinPal(data);
                this.snedDatatoUser(res, 200, result);
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
            const response = await this.service.connctionWithZainPal(this.paymentUrl, {
                merchant_id: this.shenaseSite,
                amount: this.paymentPrice,
                callback_url: `${this.callbackUrl}${orderId}`,
                description: ` buy tour from site tour.com `,
            });
            const authority = response.data.authority;
            return authority || false;
        };
        this.startPayUrl = process.env.START_PAY2;
        this.paymentPrice = 0;
        this.callbackUrl = process.env.CALLBACK_URL_WITHOUT_ORDERID;
        this.service = new orderService_1.default();
        this.shenaseSite = process.env.SITE_PAYMENT_ID;
        this.paymentUrl = process.env.PAYMENT_URL_CONNECTON1;
        this.checkPaymentUrl = process.env.CHECK_PAYMENT3;
    }
}
exports.default = orderController;
