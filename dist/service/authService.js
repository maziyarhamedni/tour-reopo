"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userQuery_1 = __importDefault(require("../repository/userQuery"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_1 = __importDefault(require("./../utils/email"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const redisClient_1 = __importDefault(require("../repository/redisClient"));
class authService {
    constructor() {
        this.sendEmail = async (emailOption) => {
            await (0, email_1.default)(emailOption);
        };
        this.checkSignUp = async (data) => {
            if (data.password == data.passwordConfrim) {
                const newUser = await this.userQuery.CreateNewUser(data);
                return newUser;
            }
            else {
                return false;
            }
        };
        this.checkLogIn = async (email, password) => {
            const user = await this.userQuery.findUserByEmail(email);
            if (!user || !(await this.checkUserPassword(password, user.password))) {
                return false;
            }
            return user;
        };
        this.jwtVerifyPromisified = async function jwtVerify(token, secret) {
            return new Promise((resolve, reject) => {
                jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
                    if (err)
                        return reject(err);
                    resolve(decoded);
                });
            });
        };
        this.forgotPasswordService = async (email) => {
            const user = await this.userQuery.findUserByEmail(email);
            const resetToken = await this.userQuery.createResetPasswordToken(email);
            if (!user || !resetToken) {
                return false;
            }
            else {
                return { resetToken, user };
            }
        };
        this.updateMe = async (email, data) => {
            await this.userQuery.updateUser(email, data);
            return true;
        };
        this.findUserIdAndPassChangeRecently = async (id, iat) => {
            const user = await this.userQuery.findUserById(id);
            if (!user)
                return false;
            const passwordChengeRecently = await this.isPassChengeAfterCookieSet(iat, user.passwordChengeAt);
            return passwordChengeRecently ? false : user;
        };
        this.resetPasswordService = async (resetToken, password, id) => {
            const result = await this.userQuery.isTokenMatchWithRedis(resetToken, id);
            const user = await this.userQuery.findUserById(id);
            if (!user || !result)
                return false;
            const pass = await this.userQuery.hashPassword(password);
            await this.userQuery.updateUser(user.email, {
                password: pass,
            });
            return user;
        };
        this.passwordChengedAfterSetToken = async (jwtIat, passChenge) => {
            const passChengeAt = parseInt(`${passChenge.getTime() / 1000}`, 10);
            console.log(` is pass change after setToken ${passChengeAt > jwtIat} `);
            return (passChengeAt > jwtIat);
        };
        this.updatePasswordServiced = async (id, oldPassword, newPassword) => {
            const user = await this.userQuery.findUserById(id);
            const result = await this.checkUserPassword(oldPassword, user === null || user === void 0 ? void 0 : user.password);
            if (!user || !result)
                return false;
            const pass = await this.userQuery.hashPassword(newPassword);
            await this.userQuery.updateUser(user === null || user === void 0 ? void 0 : user.email, {
                password: pass,
                passwordChengeAt: new Date(),
            });
            return user;
        };
        this.checkUserRole = async (id, roles) => {
            const user = await this.userQuery.findUserById(id);
            if (user && roles.includes(user.role)) {
                return user;
            }
            else {
                return false;
            }
        };
        this.isPassChengeAfterCookieSet = async (tokenTime, passChengeDate) => {
            const res = this.passwordChengedAfterSetToken(tokenTime, passChengeDate);
            return res;
        };
        this.checkUserPassword = async (interedPass, userPass) => {
            const res = this.correctPassword(interedPass, userPass);
            return res;
        };
        this.accessOnlyOwnUserAndAdmin = async (id, user) => {
            const getUser = await this.userQuery.findUserById(id);
            if (getUser) {
                if (user.role == 'ADMIN' || getUser.id == user.id) {
                    const userWithOrder = Object.assign(Object.assign({}, getUser), { order: [] });
                    return userWithOrder;
                }
                return false;
            }
        };
        this.getAllUser = async () => {
            const users = await this.userQuery.getAllUser();
            return users ? users : false;
        };
        this.deleteUserService = async (id) => {
            const deletedUser = await this.userQuery.findUserById(id);
            if (deletedUser) {
                await this.userQuery.updateUser(deletedUser.email, {
                    isActive: false,
                });
                return deletedUser;
            }
            return false;
        };
        this.userQuery = new userQuery_1.default();
        this.redis = redisClient_1.default;
    }
    jwtTokenCreator(id, secret) {
        return jsonwebtoken_1.default.sign({ id: id }, secret);
    }
    async correctPassword(password, hashedPassword) {
        if (hashedPassword) {
            return await bcryptjs_1.default.compare(password, hashedPassword);
        }
    }
}
exports.default = authService;
