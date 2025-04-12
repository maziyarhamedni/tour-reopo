"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = __importDefault(require("./model"));
class ReviewModel {
    constructor() {
        this.tour = model_1.default.tour;
        this.review = model_1.default.review;
        this.user = model_1.default.user;
    }
}
exports.default = ReviewModel;
