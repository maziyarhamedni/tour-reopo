"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orderQuery_1 = __importDefault(require("../repository/orderQuery"));
const tourQuery_1 = __importDefault(require("../repository/tourQuery"));
class OrderService {
    constructor() {
        this.createOrder = async (tourid, userid) => {
            const tour = await this.tourQuery.findTourById(tourid);
            if (tour) {
                const order = await this.orderQuery.addOrderToUser(userid, tourid);
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
