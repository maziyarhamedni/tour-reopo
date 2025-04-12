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
const userModel_1 = __importDefault(require("./../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const client_1 = require("@prisma/client");
class UserQuery {
    constructor() {
        this.hashPassword = (input) => __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.hash(input, 10);
        });
        this.CreateNewUser = (userInfo) => __awaiter(this, void 0, void 0, function* () {
            const pass = yield this.hashPassword(userInfo.password);
            const date = Date.now().toString();
            const newUser = yield this.model.user.create({
                data: {
                    name: userInfo.name,
                    email: userInfo.email,
                    lastName: userInfo.lastName,
                    password: pass,
                    passwordConfrim: 'ok',
                    passwordChengeAt: new Date(),
                    resetPassword: date + 'e',
                    role: client_1.Role.USER,
                    expiredTime: '',
                    isActive: true,
                    photo: userInfo.photo
                },
            });
            return newUser;
        });
        this.findUserByEmail = (email) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.model.user.findUnique({
                where: {
                    email: email,
                    isActive: true,
                },
            });
            return user;
        });
        this.findUserById = (id) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.model.user.findUnique({
                where: {
                    id: id,
                    isActive: true,
                },
            });
            return user;
        });
        this.isPassChengeRecently = (tokenTime, passChengeDate) => __awaiter(this, void 0, void 0, function* () {
            const res = this.model.passwordChenged(tokenTime, passChengeDate);
            return res;
        });
        this.updateUser = (userEmail, data) => __awaiter(this, void 0, void 0, function* () {
            yield this.model.user.update({
                where: {
                    email: userEmail,
                    isActive: true,
                },
                data,
            });
        });
        this.checkUserPassword = (interedPass, userPass) => __awaiter(this, void 0, void 0, function* () {
            const res = this.model.correctPassword(interedPass, userPass);
            return res;
        });
        this.findUserByRestToken = (resetToken) => __awaiter(this, void 0, void 0, function* () {
            const token = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
            if (!token) {
                return false;
            }
            const user = yield this.model.user.findUnique({
                where: {
                    resetPassword: token,
                    isActive: true,
                },
            });
            if (user && parseInt(user.expiredTime) > Date.now()) {
                return user;
            }
            return false;
        });
        this.createResetPasswordToken = (email) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findUserByEmail(email);
            const date = (Date.now() + 10 * 60 * 1000).toString();
            const resetToken = crypto_1.default.randomBytes(32).toString('hex');
            if (user) {
                user.resetPassword = crypto_1.default
                    .createHash('sha256')
                    .update(resetToken)
                    .digest('hex');
                yield this.updateUser(email, {
                    resetPassword: user.resetPassword,
                    expiredTime: date,
                });
                return resetToken;
            }
        });
        this.model = new userModel_1.default();
    }
}
exports.default = UserQuery;
