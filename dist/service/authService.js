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
const userQuery_1 = __importDefault(require("../repository/userQuery"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_1 = __importDefault(require("./../utils/email"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class authService {
    constructor() {
        this.sendResetTokenToEmail = (emailOption) => __awaiter(this, void 0, void 0, function* () {
            yield (0, email_1.default)(emailOption);
        });
        this.checkSignUp = (data) => __awaiter(this, void 0, void 0, function* () {
            if (data.password == data.passwordConfrim) {
                console.log('pass and confrim pass correct');
                const newUser = yield this.userQuery.CreateNewUser(data);
                return newUser;
            }
            else {
                return false;
            }
        });
        this.checkLogIn = (email, password) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userQuery.findUserByEmail(email);
            if (!user || !(yield this.checkUserPassword(password, user.password))) {
                return false;
            }
            return user;
        });
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
        this.forgotPasswordService = (email) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userQuery.findUserByEmail(email);
            const resetToken = yield this.userQuery.createResetPasswordToken(email);
            if (!user || !resetToken) {
                return false;
            }
            else {
                return { resetToken, user };
            }
        });
        this.findUserIdAndPassChangeRecently = (id, iat) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userQuery.findUserById(id);
            if (!user)
                return false;
            const passwordChengeRecently = yield this.isPassChengeRecently(iat, user.passwordChengeAt);
            if (passwordChengeRecently)
                return false;
            return user;
        });
        this.resetPasswordService = (resetToken, password) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userQuery.findUserByRestToken(resetToken);
            if (!user)
                return false;
            const pass = yield this.userQuery.hashPassword(password);
            yield this.userQuery.updateUser(user.email, {
                resetPassword: '',
                expiredTime: '',
                password: pass,
            });
            return user;
        });
        this.passwordChenged = (jwtIat, passChenge) => __awaiter(this, void 0, void 0, function* () {
            const passChengeAt = parseInt(`${passChenge.getTime() / 1000}`, 10);
            return passChengeAt > jwtIat;
        });
        this.updatePasswordServiced = (id, oldPassword, newPassword) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userQuery.findUserById(id);
            const result = yield this.checkUserPassword(oldPassword, user === null || user === void 0 ? void 0 : user.password);
            if (!user || !result)
                return false;
            const pass = yield this.userQuery.hashPassword(newPassword);
            yield this.userQuery.updateUser(user === null || user === void 0 ? void 0 : user.email, {
                password: pass,
                passwordChengeAt: new Date(),
            });
            return user;
        });
        this.checkUserRole = (id, roles) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userQuery.findUserById(id);
            if (user && roles.includes(user.role)) {
                return user;
            }
            else {
                return false;
            }
        });
        this.isPassChengeRecently = (tokenTime, passChengeDate) => __awaiter(this, void 0, void 0, function* () {
            const res = this.passwordChenged(tokenTime, passChengeDate);
            return res;
        });
        this.checkUserPassword = (interedPass, userPass) => __awaiter(this, void 0, void 0, function* () {
            const res = this.correctPassword(interedPass, userPass);
            return res;
        });
        this.getUser = (id, user) => __awaiter(this, void 0, void 0, function* () {
            const getUser = yield this.userQuery.findUserById(id);
            if (getUser) {
                if (user.role == 'ADMIN' || getUser.id == user.id) {
                    return getUser;
                }
                return false;
            }
        });
        this.getAllUser = () => __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userQuery.getAllUser();
            return users ? users : false;
        });
        this.deleteUserService = (id) => __awaiter(this, void 0, void 0, function* () {
            const deletedUser = yield this.userQuery.findUserById(id);
            if (deletedUser) {
                yield this.userQuery.updateUser(deletedUser.email, {
                    isActive: false,
                });
                return deletedUser;
            }
            return false;
        });
        this.userQuery = new userQuery_1.default();
    }
    jwtTokenCreator(id, secret) {
        return jsonwebtoken_1.default.sign({ id: id }, secret);
    }
    correctPassword(password, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (hashedPassword) {
                return yield bcrypt_1.default.compare(password, hashedPassword);
            }
        });
    }
}
exports.default = authService;
