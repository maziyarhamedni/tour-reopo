"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orderQuery_1 = __importDefault(require("../repository/orderQuery"));
const tourQuery_1 = __importDefault(require("../repository/tourQuery"));
class OrderService {
    constructor() {
        this.findOrderForUser = async (orderId) => {
            const order = await this.orderQuery.findOrderById(orderId);
            return order ? order : false;
        };
        this.sentTourPrice = async (tourId) => {
            const tour = await this.tourQuery.findTourById(tourId);
            const price = tour === null || tour === void 0 ? void 0 : tour.price;
            return tour ? price : false;
        };
        this.createOrder = async (tourid, userid) => {
            const tour = await this.tourQuery.findTourById(tourid);
            if (tour) {
                const order = await this.orderQuery.addOrder(userid, tourid);
                return order ? order : false;
            }
        };
        this.getOrderbyUserId = async (userId) => {
            const orders = await this.orderQuery.findOrderByUserId(userId);
            return orders ? orders : false;
        };
        this.orderQuery = new orderQuery_1.default();
        this.tourQuery = new tourQuery_1.default();
    }
}
exports.default = OrderService;
