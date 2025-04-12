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
const model_1 = __importDefault(require("./model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// import { NextFunction } from 'express';
class UserModel {
    constructor() {
        this.user = model_1.default.user;
    }
    passwordChenged(jwtIat, passChenge) {
        return __awaiter(this, void 0, void 0, function* () {
            const passChengeAt = parseInt(`${passChenge.getTime() / 1000}`, 10);
            return passChengeAt > jwtIat;
        });
    }
    correctPassword(password, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (hashedPassword) {
                return yield bcrypt_1.default.compare(password, hashedPassword);
            }
        });
    }
}
module.exports = UserModel;
