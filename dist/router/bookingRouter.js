"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controller/authController"));
const bookingRouter = express_1.default.Router();
const authorize = new authController_1.default();
bookingRouter
    .route('/:tourid')
    .post(authorize.protect, authorize.getAllUsers);
bookingRouter
    .route('/:id')
    .get(authorize.authorizeAdmin('ADMIN', 'USER'), authorize.getUser);
exports.default = bookingRouter;
