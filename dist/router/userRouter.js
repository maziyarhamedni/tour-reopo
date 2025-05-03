"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controller/authController"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ dest: 'public/imag/users' });
const userRouter = express_1.default.Router();
const authorize = new authController_1.default();
userRouter.post('/signup', authorize.signUp);
userRouter.post('/login', authorize.logIn);
userRouter.post('/forgotPassword', authorize.forgotPassword);
userRouter.patch('/updatepassword', authorize.protect, authorize.updatePassword);
userRouter.patch('/resetPassword/:token/:userId', authorize.resetPassword);
userRouter.use(authorize.protect);
userRouter
    .route('/')
    .get(authorize.authorizeAdmin('ADMIN'), authorize.getAllUsers);
userRouter
    .route('/:id')
    .get(authorize.authorizeAdmin('ADMIN', 'USER'), authorize.getUser)
    .patch(upload.single('photo'), authorize.updateUser)
    .delete(authorize.authorizeAdmin('ADMIN', 'USER'), authorize.deleteUser);
exports.default = userRouter;
