"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const model_1 = __importDefault(require("./model"));
class TourModel {
    constructor() {
        this.tour = model_1.default.tour;
        this.startLocation = model_1.default.startLocation;
        this.location = model_1.default.location;
        this.prisma = model_1.default;
    }
}
module.exports = TourModel;
