"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controller/authController"));
const orderController_1 = __importDefault(require("../controller/orderController"));
const orderControl = new orderController_1.default();
const orderRouter = express_1.default.Router();
const authorize = new authController_1.default();
orderRouter
    .route('/buy/:orderId')
    .post(authorize.protect, orderControl.redirectUserToPayment);
orderRouter
    .route('/addtomyorder/:tourId')
    .post(authorize.protect, orderControl.addTourToMyOrder);
orderRouter
    .route('/myorder')
    .get(authorize.protect, orderControl.getOrderByUserId);
exports.default = orderRouter;
