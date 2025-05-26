"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = __importDefault(require("./repository"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const client_1 = require("@prisma/client");
const redisClient_1 = __importDefault(require("./redisClient"));
class UserQuery extends repository_1.default {
    constructor() {
        super();
        this.hashPassword = async (input) => {
            return await bcryptjs_1.default.hash(input, 10);
        };
        this.CreateNewUser = async (userInfo) => {
            const pass = await this.hashPassword(userInfo.password);
            const newUser = await this.user.create({
                data: {
                    name: userInfo.name,
                    email: userInfo.email,
                    lastName: userInfo.lastName,
                    password: pass,
                    passwordChengeAt: new Date(),
                    role: client_1.Role.USER,
                    isActive: true,
                    photo: userInfo.photo,
                    orders: {
                        create: [],
                    },
                },
            });
            return newUser;
        };
        this.findUserByEmail = async (email) => {
            const user = await this.user.findUnique({
                where: {
                    email: email,
                    isActive: true,
                },
            });
            return user;
        };
        this.findUserById = async (id) => {
            const user = await this.user.findUnique({
                where: {
                    id: id,
                    isActive: true,
                },
            });
            return user;
        };
        this.getAllUser = async () => {
            const allUser = await this.user.findMany({
                omit: {
                    password: true,
                    passwordChengeAt: true,
                },
            });
            return allUser ? allUser : false;
        };
        this.updateUser = async (userEmail, data) => {
            await this.user.update({
                where: {
                    email: userEmail,
                    isActive: true,
                },
                data,
            });
        };
        this.saveResetTokenOnRedis = async (userId, token) => {
            const tokenExprition = 600;
            try {
                await this.redis.setex(userId, tokenExprition, token);
                console.log('Token saved successfully');
            }
            catch (err) {
                console.error('Error saving token:', err);
            }
        };
        this.isTokenMatchWithRedis = async (token, id) => {
            const savedToken = await this.redis.get(id);
            if (!savedToken || savedToken != token) {
                return false;
            }
            return true;
        };
        this.createResetPasswordToken = async (email) => {
            const user = await this.findUserByEmail(email);
            const resetToken = crypto_1.default.randomBytes(32).toString('hex');
            if (user) {
                await this.saveResetTokenOnRedis(user.id, resetToken);
                return resetToken;
            }
        };
        this.redis = redisClient_1.default.getInstance();
    }
}
exports.default = UserQuery;
