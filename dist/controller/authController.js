"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../utils/AppError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const authService_1 = __importDefault(require("../service/authService"));
class authController {
    constructor() {
        this.signUp = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            const result = yield this.service.checkSignUp(data);
            if (!result) {
                return next(new AppError_1.default('you are not sign up try again', 403));
            }
            this.createJwtToken(result, 201, res);
        }));
        this.logIn = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password) {
                return next(new AppError_1.default('please enter password and email ', 401));
            }
            const user = yield this.service.checkLogIn(email, password);
            if (!user) {
                return next(new AppError_1.default('email or password is not correct', 403));
            }
            this.createJwtToken(user, 200, res);
        }));
        this.protect = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let token;
            if (typeof req.headers.authorization == 'string') {
                const authorizaton = req.headers.authorization;
                if (authorizaton && authorizaton.startsWith('Bearer')) {
                    token = authorizaton.split(' ')[1];
                }
                else {
                    token = req.cookies.jwt;
                }
                const decode = yield this.service.jwtVerifyPromisified(token, this.secret);
                const user = yield this.service.findUserIdAndPassChangeRecently(decode.id, decode.iat);
                if (!decode.id || !user) {
                    return next(new AppError_1.default('user in not exists anymore ', 404));
                }
                req.user = user;
            }
            next();
        }));
        this.isLoggedIn = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (req.cookies.jwt) {
                try {
                    const decode = yield this.service.jwtVerifyPromisified(req.cookies.jwt, this.secret);
                    const user = yield this.service.findUserIdAndPassChangeRecently(decode.id, decode.iat);
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
        }));
        this.forgotPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            const data = yield this.service.forgotPasswordService(email);
            if (data) {
                const { user, resetToken } = data;
                const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
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
                    yield this.service.sendResetTokenToEmail(emailOption);
                    res.status(200).json({
                        status: 'seccessful',
                        meassge: 'check your email box ',
                    });
                }
                catch (err) {
                    next(new AppError_1.default('There was an error sending the email. Try again later!', 500));
                }
            }
        }));
        this.resetPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const resetToken = req.params.token;
            const result = yield this.service.resetPasswordService(resetToken, req.body.password);
            if (!result) {
                next(new AppError_1.default('your token is expired or token is uncorrect', 401));
            }
            else {
                this.createJwtToken(result, 200, res);
            }
        }));
        this.updatePassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.user.id;
            const oldPassword = req.body.password;
            const newPassword = req.body.newPassword;
            const result = yield this.service.updatePasswordServiced(id, oldPassword, newPassword);
            if (!result) {
                return next(new AppError_1.default('user not found ', 404));
            }
            this.createJwtToken(result, 200, res);
        }));
        this.authorizeAdmin = (...roles) => {
            return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                const user = yield this.service.checkUserRole(req.user.id, roles);
                if (!user) {
                    next(new AppError_1.default('you cannot access to this mission', 403));
                }
                next();
            });
        };
        this.deleteUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const isDeleteUser = yield this.service.deleteUserService(id);
            if (!isDeleteUser) {
                return next(new AppError_1.default('cant delete user', 404));
            }
            this.createJwtToken(isDeleteUser, 204, res);
        }));
        this.secret = process.env.JWT_SECRET;
        this.cookieExpire = parseInt(process.env.JWT_COOKIE_EXPIRSE_IN);
        this.service = new authService_1.default();
    }
    createJwtToken(user, statusCode, res) {
        const token = this.service.jwtTokenCreator(user.id, this.secret);
        const cookieOption = {
            expires: new Date(Date.now() + this.cookieExpire * 24 * 60 * 60 * 1000),
            secure: false,
            httpOnly: true,
        };
        if (process.env.NODE_ENV == 'production') {
            cookieOption.secure = true;
        }
        res.cookie('jwt', token, cookieOption);
        //  i am must be create a interface
        ////
        ///////////////
        //////////
        user.password = '';
        user.passwordConfrim = '';
        res.status(statusCode).json({
            status: 'seccessful',
            token: token,
            data: {
                user,
            },
        });
    }
}
exports.default = authController;
