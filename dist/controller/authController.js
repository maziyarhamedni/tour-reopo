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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const userQuery_1 = __importDefault(require("./../repository/userQuery"));
const email_1 = __importDefault(require("./../utils/email"));
class authController {
    constructor() {
        this.signUp = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            if (data.password == data.passwordConfrim) {
                console.log('pass and confrim pass correct');
                const newUser = yield this.userQurey.CreateNewUser(data);
                this.createSendToken(newUser, 201, res);
            }
            else {
                return next(new AppError_1.default('passwords not match', 401));
            }
        }));
        //////////////////
        this.logIn = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password) {
                return next(new AppError_1.default('password or email is wrong', 401));
            }
            const user = yield this.userQurey.findUserByEmail(email);
            if (!user ||
                !(yield this.userQurey.checkUserPassword(password, user.password))) {
                return next(new AppError_1.default('password or email is wrong ... try again ', 401));
            }
            this.createSendToken(user, 200, res);
        }));
        this.jwtVerifyPromisified = function jwtVerify(token, secret) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
                        if (err)
                            return reject(err);
                        resolve(decoded);
                    });
                });
            });
        };
        this.protect = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let token;
            if (typeof req.headers.authorization == 'string') {
                const authorizaton = req.headers.authorization;
                if (authorizaton && authorizaton.startsWith('Bearer')) {
                    token = authorizaton.split(' ')[1];
                }
                else {
                    token = req.cookies.jwt;
                    console.log(req.cookies.jwt);
                }
                const decode = yield this.jwtVerifyPromisified(token, this.secret);
                const user = yield this.userQurey.findUserById(decode.id);
                if (!decode.id || !user) {
                    return next(new AppError_1.default('user in not exists anymore ', 404));
                }
                const passwordChengeRecently = yield this.userQurey.isPassChengeRecently(decode.iat, user.passwordChengeAt);
                if (passwordChengeRecently) {
                    return next(new AppError_1.default('user change password recently please login again ... ', 401));
                }
                req.user = user;
            }
            next();
        }));
        // isAdmin
        this.forgotPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            const user = yield this.userQurey.findUserByEmail(email);
            if (!user)
                return next(new AppError_1.default('user not exists please inter valid email', 401));
            //at first find user by email and create token in datavbase
            const resetToken = yield this.userQurey.createResetPasswordToken(email);
            const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
            const message = `Forgot your password? 
      Submit a PATCH request with your new password
       and passwordConfirm to: ${resetURL}.\n
       If you didn't forget your password, please ignore this email!`;
            // send resetToken to email
            try {
                yield (0, email_1.default)({
                    email: user.email,
                    subject: 'Your password reset token (valid for 10 min)',
                    message: message,
                });
                res.status(200).json({
                    status: 'seccess',
                    meassge: 'check your email box ',
                });
            }
            catch (err) {
                next(new AppError_1.default('There was an error sending the email. Try again later!', 500));
            }
        }));
        this.resetPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const resetToken = req.params.token;
            const user = yield this.userQurey.findUserByRestToken(resetToken);
            if (!user) {
                next(new AppError_1.default('your token is expired or token is uncorrect', 401));
            }
            else {
                const pass = yield this.userQurey.hashPassword(req.body.password);
                console.log(pass);
                yield this.userQurey.updateUser(user.email, {
                    resetPassword: '',
                    expiredTime: '',
                    password: pass,
                    passwordChengeAt: new Date(),
                });
                this.createSendToken(user, 200, res);
            }
        }));
        this.updatePassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            console.log(req.user);
            const user = yield this.userQurey.findUserById(req.user.id);
            const interdPassword = req.body.password;
            const newPassword = req.body.newPassword;
            const result = yield this.userQurey.checkUserPassword(interdPassword, user === null || user === void 0 ? void 0 : user.password);
            // console.log(user, interdPassword, result);
            if (user && result) {
                const pass = yield this.userQurey.hashPassword(newPassword);
                yield this.userQurey.updateUser(user === null || user === void 0 ? void 0 : user.email, {
                    password: pass,
                    passwordChengeAt: new Date(),
                });
                this.createSendToken(user, 201, res);
            }
            else {
                return next(new AppError_1.default('password is not correct', 401));
            }
        }));
        this.authorizeAdmin = (...roles) => {
            return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                const user = yield this.userQurey.findUserById(req.user.id);
                if (!user || !roles.includes(req.user.role)) {
                    next(new AppError_1.default('you cannot access to this mission', 403));
                }
                next();
            });
        };
        this.deleteUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const deletedUser = yield this.userQurey.findUserById(req.params.id);
            if (deletedUser) {
                console.log(deletedUser.email);
                yield this.userQurey.updateUser(deletedUser.email, {
                    isActive: false,
                });
                this.createSendToken(deletedUser, 204, res);
            }
            next(new AppError_1.default('user not found inter vlalid id ', 404));
        }));
        this.secret = process.env.JWT_SECRET;
        this.userQurey = new userQuery_1.default();
        this.cookieExpire = parseInt(process.env.JWT_COOKIE_EXPIRSE_IN);
    }
    jwtTokenCreator(id) {
        return jsonwebtoken_1.default.sign({ id: id }, this.secret);
    }
    createSendToken(user, statusCode, res) {
        const token = this.jwtTokenCreator(user.id);
        const cookieOption = {
            expires: new Date(Date.now() + this.cookieExpire * 24 * 60 * 60 * 1000),
            secure: false,
            httpOnly: true,
        };
        if (process.env.NODE_ENV == 'production') {
            cookieOption.secure = true;
        }
        res.cookie('jwt', token, cookieOption);
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
