"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../utils/AppError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const authService_1 = __importDefault(require("../service/authService"));
class userController {
    constructor() {
        this.snedResponse = (statusCode, data, res) => {
            const user = this.setUserInfoSafe(data);
            res.status(statusCode).json(user);
        };
        this.setUserInfoSafe = (user) => {
            const { email, id, lastName, photo, name, role } = user;
            const sendedUser = { email, id, lastName, photo, name, role };
            return sendedUser;
        };
        this.deleteUser = (0, catchAsync_1.default)(async (req, res, next) => {
            const id = req.params.id;
            const isDeleteUser = await this.service.deleteUserService(id);
            if (!isDeleteUser) {
                return next(new AppError_1.default('cant delete user', 404));
            }
            const userWithOrder = Object.assign(Object.assign({}, isDeleteUser), { order: [], expiredTime: new Date(), resetPassword: '' });
            this.createJwtToken(userWithOrder, 204, res);
        });
        this.getAllUsers = (0, catchAsync_1.default)(async (req, res, next) => {
            const users = await this.service.getAllUser();
            if (users) {
                res.status(200).json({
                    message: 'seccuseful',
                    data: users,
                });
            }
        });
        this.getUser = (0, catchAsync_1.default)(async (req, res, next) => {
            const user = await this.service.getUser(req.params.id, req.user);
            if (!user) {
                return next(new AppError_1.default('cant get users', 404));
            }
            const userWithOrder = Object.assign(Object.assign({}, user), { order: [], expiredTime: new Date(), resetPassword: '' });
            this.snedResponse(200, userWithOrder, res);
        });
        this.updateUser = (0, catchAsync_1.default)(async (req, res) => {
            // const id = req.params.id;
            console.log(req.file);
            // console.log(req.body);
            res.json(req.body);
        });
        this.secret = process.env.JWT_SECRET;
        this.cookieExpire = parseInt(process.env.JWT_COOKIE_EXPIRSE_IN);
        this.dayInMiliSecond = parseInt(process.env.DAY_IN_MILISECOND);
        this.service = new authService_1.default();
    }
    createJwtToken(user, statusCode, res) {
        const sendedUser = this.setUserInfoSafe(user);
        const token = this.service.jwtTokenCreator(user.id, this.secret);
        const cookieOption = {
            expires: new Date(Date.now() + this.cookieExpire * this.dayInMiliSecond),
            secure: false,
            httpOnly: true,
        };
        if (process.env.NODE_ENV == 'production') {
            cookieOption.secure = true;
        }
        res.cookie('jwt', token, cookieOption);
        res.status(statusCode).json({
            status: 'seccessful',
            token: token,
            data: {
                sendedUser,
            },
        });
    }
}
exports.default = userController;
