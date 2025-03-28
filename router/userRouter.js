"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_js_1 = __importDefault(require("./../controller/userController.js"));
const authController_1 = __importDefault(require("../controller/authController"));
const userRouter = express_1.default.Router();
const controller = new userController_js_1.default();
const authorize = new authController_1.default();
userRouter.post('/signup', authorize.signUp);
userRouter.post('/login', authorize.logIn);
userRouter.post('/forgotPassword', authorize.forgotPassword);
userRouter.patch('/updatepassword', authorize.protect, authorize.updatePassword);
userRouter.patch('/resetPassword/:token', authorize.resetPassword);
userRouter.route('/').get(controller.getAllUsers);
userRouter
    .route('/:id')
    .get(controller.getUser)
    .patch(controller.updateUser)
    .delete(authorize.protect, authorize.authorizeAdmin('ADMIN'), authorize.deleteUser);
exports.default = userRouter;
