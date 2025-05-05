"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orderQuery_1 = __importDefault(require("../repository/orderQuery"));
const tourQuery_1 = __importDefault(require("../repository/tourQuery"));
class OrderService {
    constructor() {
        this.createOrder = async (tourid, userid, price, data) => {
            const tour = await this.tourQuery.findTourById(tourid);
            if (tour) {
                const count = (tour === null || tour === void 0 ? void 0 : tour.price) / price;
                console.log(`tour price is ${tour.price} and user paid ${price}`);
                const order = await this.orderQuery.addOrderToUser(userid, tourid, count, tour.startDates[0], data);
                //delete tedatourda karbar
                const group = tour.maxGroupSize - count;
                await this.tourQuery.updateTour(tourid, { maxGroupSize: group });
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
