"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controller/authController"));
const userController_1 = __importDefault(require("../controller/userController"));
const userRouter = express_1.default.Router();
const authorize = new authController_1.default();
const userControl = new userController_1.default();
userRouter.post('/signup', authorize.signUp);
userRouter.post('/login', authorize.logIn);
userRouter.post('/forgotPassword', authorize.forgotPassword);
userRouter.patch('/updatepassword', authorize.protect, authorize.updatePassword);
userRouter.patch('/resetPassword/:token/:userId', authorize.resetPassword);
userRouter.use(authorize.protect);
userRouter
    .route('/')
    .get(authorize.accessRoleIs('ADMIN'), userControl.getAllUsers);
userRouter
    .route('/:id')
    .get(userControl.getUser)
    .patch(userControl.uploadUserPhoto, userControl.resizePhoto, userControl.updateUser)
    .delete(userControl.deleteUser);
exports.default = userRouter;
