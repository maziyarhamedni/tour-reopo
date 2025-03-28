"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const model_1 = __importDefault(require("./model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// import { NextFunction } from 'express';
class UserModel {
    constructor() {
        this.user = model_1.default.user;
    }
    async passwordChenged(jwtIat, passChenge) {
        const passChengeAt = parseInt(`${passChenge.getTime() / 1000}`, 10);
        return passChengeAt > jwtIat;
    }
    async correctPassword(password, hashedPassword) {
        if (hashedPassword) {
            return await bcrypt_1.default.compare(password, hashedPassword);
        }
    }
}
module.exports = UserModel;
