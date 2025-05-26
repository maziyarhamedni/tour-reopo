"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../utils/AppError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const authService_1 = __importDefault(require("../service/authService"));
class authController {
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
        this.signUp = (0, catchAsync_1.default)(async (req, res, next) => {
            const data = req.body;
            const result = await this.service.checkSignUp(data);
            if (!result) {
                return next(new AppError_1.default('you are not sign up try again', 403));
            }
            const userWithOrder = Object.assign(Object.assign({}, result), { order: [] });
            this.createJwtToken(userWithOrder, 201, res);
        });
        this.logIn = (0, catchAsync_1.default)(async (req, res, next) => {
            const { email, password } = req.body;
            if (!email || !password) {
                return next(new AppError_1.default('please enter password and email ', 401));
            }
            const user = await this.service.checkLogIn(email, password);
            if (!user) {
                return next(new AppError_1.default('email or password is not correct', 403));
            }
            const userWithOrder = Object.assign(Object.assign({}, user), { order: [] });
            this.createJwtToken(userWithOrder, 200, res);
        });
        this.protect = (0, catchAsync_1.default)(async (req, res, next) => {
            let token;
            if (typeof req.headers.authorization == 'string') {
                const authorizaton = req.headers.authorization;
                if (authorizaton && authorizaton.startsWith('Bearer')) {
                    token = authorizaton.split(' ')[1];
                }
                else {
                    token = await req.cookies.jwt;
                }
            }
            else {
                token = await req.cookies.jwt;
            }
            const decode = await this.service.jwtVerifyPromisified(token, this.secret);
            const user = await this.service.findUserIdAndPassChangeRecently(decode.id, decode.iat);
            if (!decode.id || !user) {
                return next(new AppError_1.default('user in not exists anymore ', 404));
            }
            const userWithOrder = Object.assign(Object.assign({}, user), { order: [] });
            const safeUser = this.setUserInfoSafe(userWithOrder);
            req.user = safeUser;
            next();
        });
        this.isLoggedIn = (0, catchAsync_1.default)(async (req, res, next) => {
            if (req.cookies.jwt) {
                try {
                    const decode = await this.service.jwtVerifyPromisified(req.cookies.jwt, this.secret);
                    const user = await this.service.findUserIdAndPassChangeRecently(decode.id, decode.iat);
                    if (!user) {
                        return next();
                    }
                    res.locals.user = user;
                    return next();
                }
                catch (err) {
                    console.error('Error verifying JWT or finding user:', err);
                    return next();
                }
            }
            next();
        });
        this.forgotPassword = (0, catchAsync_1.default)(async (req, res, next) => {
            const email = req.body.email;
            const data = await this.service.forgotPasswordService(email);
            if (data) {
                const { user, resetToken } = data;
                const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}/${user.id}`;
                const message = `Forgot your password? 
        Submit a PATCH request with your new password
         and passwordConfirm to: ${resetURL}.\n
         If you didn't forget your password, please ignore this email!`;
                const emailOption = {
                    email: user.email,
                    subject: 'Your password reset token (valid for 10 min)',
                    message: message,
                };
                try {
                    await this.service.sendEmail(emailOption);
                    res.status(200).json({
                        status: 'seccessful',
                        meassge: 'check your email box ',
                    });
                }
                catch (err) {
                    next(new AppError_1.default('There was an error sending the email. Try again later!', 500));
                }
            }
        });
        this.resetPassword = (0, catchAsync_1.default)(async (req, res, next) => {
            const { token, userId } = req.params;
            const password = req.body.password;
            const user = await this.service.resetPasswordService(token, password, userId);
            if (user) {
                const userWithOrder = Object.assign(Object.assign({}, user), { order: [] });
                this.createJwtToken(userWithOrder, 201, res);
            }
        });
        this.updatePassword = (0, catchAsync_1.default)(async (req, res, next) => {
            const id = req.user.id;
            const oldPassword = req.body.password;
            const newPassword = req.body.newPassword;
            const result = await this.service.updatePasswordServiced(id, oldPassword, newPassword);
            if (!result) {
                return next(new AppError_1.default('user not found ', 404));
            }
            const userWithOrder = Object.assign(Object.assign({}, result), { order: [] });
            this.createJwtToken(userWithOrder, 200, res);
        });
        this.accessRoleIs = (...roles) => {
            return async (req, res, next) => {
                const curentUser = req.user;
                const user = await this.service.checkUserRole(curentUser.id, roles);
                if (!user) {
                    next(new AppError_1.default('you cannot access to this mission', 403));
                }
                next();
            };
        };
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
exports.default = authController;
