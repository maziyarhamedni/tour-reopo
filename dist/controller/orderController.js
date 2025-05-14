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
            let data;
            if (typeof Authority == 'string') {
                const response = await this.service.connctionWithZainPal(this.checkPaymentUrl, {
                    merchant_id: this.shenaseSite,
                    amount: orderPrice,
                    authority: Authority,
                });
                data = await response.data;
            }
            ///////////////                now i must add this to prisma
            //////////////                  and seprate axios requsets sfe
            /////////////                    and add trx to database to save
            ////////////                      and user transaction on database
            if (data.code == 100) {
                data.order_id = orderId;
                const trx = await this.service.createTrx(data);
                console.log(trx);
            }
            else if (data.code == 101) {
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
                callback_url: `http://127.0.0.1:3000/api/v1/order/checkPayment/${orderId}`,
                description: ` buy tour from site tour.com `,
            });
            const authority = response.data.authority;
            return authority || false;
        };
        this.startPayUrl = process.env.START_PAY2;
        this.paymentPrice = 0;
        this.service = new orderService_1.default();
        this.shenaseSite = process.env.SITE_PAYMENT_ID;
        this.paymentUrl = process.env.PAYMENT_URL_CONNECTON1;
        this.checkPaymentUrl = process.env.CHECK_PAYMENT3;
    }
}
exports.default = orderController;
