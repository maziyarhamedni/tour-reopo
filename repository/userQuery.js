"use strict";
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
        this.hashPassword = async (input) => {
            return await bcrypt_1.default.hash(input, 10);
        };
        this.CreateNewUser = async (userInfo) => {
            const pass = await this.hashPassword(userInfo.password);
            const date = Date.now().toString();
            const newUser = await this.model.user.create({
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
        };
        this.findUserByEmail = async (email) => {
            const user = await this.model.user.findUnique({
                where: {
                    email: email,
                    isActive: true,
                },
            });
            return user;
        };
        this.findUserById = async (id) => {
            const user = await this.model.user.findUnique({
                where: {
                    id: id,
                    isActive: true,
                },
            });
            return user;
        };
        this.isPassChengeRecently = async (tokenTime, passChengeDate) => {
            const res = this.model.passwordChenged(tokenTime, passChengeDate);
            return res;
        };
        this.updateUser = async (userEmail, data) => {
            await this.model.user.update({
                where: {
                    email: userEmail,
                    isActive: true,
                },
                data,
            });
        };
        this.checkUserPassword = async (interedPass, userPass) => {
            const res = this.model.correctPassword(interedPass, userPass);
            return res;
        };
        this.findUserByRestToken = async (resetToken) => {
            const token = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
            if (!token) {
                return false;
            }
            const user = await this.model.user.findUnique({
                where: {
                    resetPassword: token,
                    isActive: true,
                },
            });
            if (user && parseInt(user.expiredTime) > Date.now()) {
                return user;
            }
            return false;
        };
        this.createResetPasswordToken = async (email) => {
            const user = await this.findUserByEmail(email);
            const date = (Date.now() + 10 * 60 * 1000).toString();
            const resetToken = crypto_1.default.randomBytes(32).toString('hex');
            if (user) {
                user.resetPassword = crypto_1.default
                    .createHash('sha256')
                    .update(resetToken)
                    .digest('hex');
                await this.updateUser(email, {
                    resetPassword: user.resetPassword,
                    expiredTime: date,
                });
                return resetToken;
            }
        };
        this.model = new userModel_1.default();
    }
}
exports.default = UserQuery;
