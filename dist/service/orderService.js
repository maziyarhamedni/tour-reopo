"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orderQuery_1 = __importDefault(require("../repository/orderQuery"));
const tourQuery_1 = __importDefault(require("../repository/tourQuery"));
const axios_1 = __importDefault(require("axios"));
class OrderService {
    constructor() {
        this.connctionWithZainPal = async (url, data) => {
            try {
                const response = await axios_1.default.post(url, data, {
                    headers: {
                        accept: 'application/json',
                        'content-type': 'application/json',
                    },
                });
                return await response.data;
            }
            catch (error) {
                const axiosError = error;
                console.error('Error:', axiosError.response ? axiosError.response.data : axiosError.message);
                return false;
            }
        };
        this.updateOrderStatus = async (orderId) => {
            const order = await this.orderQuery.findOrderById(orderId);
            if (order) {
                const res = await this.orderQuery.order.update({
                    where: {
                        id: order.id,
                    },
                    data: {
                        status: 'paid',
                    },
                });
            }
        };
        this.createTrx = async (data) => {
            await this.updateOrderStatus(data.order_id);
            const order = await this.orderQuery.findOrderById(data.order_id);
            if (order && order.status == 'paid') {
                const trx = await this.orderQuery.createTrx(data);
                return trx || false;
            }
        };
        this.sentTourPrice = async (tourId) => {
            const tour = await this.tourQuery.findTourById(tourId);
            const price = tour === null || tour === void 0 ? void 0 : tour.price;
            return tour ? price : false;
        };
        this.createOrder = async (tourId, userId, count) => {
            const tour = await this.tourQuery.findTourById(tourId);
            if (tour) {
                const finalPrice = count * tour.price;
                const data = { tourId, userId, count, finalPrice };
                const order = await this.orderQuery.addOrder(data);
                return order || false;
            }
        };
        this.getOrderById = async (orderId) => {
            const orders = await this.orderQuery.findOrderById(orderId);
            return orders || false;
        };
        this.getOrderbyUserId = async (userId) => {
            const orders = await this.orderQuery.findOrderByUserId(userId);
            return orders || false;
        };
        this.orderQuery = new orderQuery_1.default();
        this.tourQuery = new tourQuery_1.default();
    }
}
exports.default = OrderService;
