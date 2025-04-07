"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const userQuery_1 = __importDefault(require("../repository/userQuery"));
const tourQuery_1 = __importDefault(require("../repository/tourQuery"));
class viewController {
    constructor() {
        this.getHomePage = (0, catchAsync_1.default)(async (req, res, next) => {
            // const tours = await this.tourQuery.getAllTour();
            const title = 'Home Page';
            res.status(200).render('base', { title: title });
        });
        this.getTour = (0, catchAsync_1.default)(async (req, res, next) => {
            const title = 'Over View page';
            res.status(200).render('tour', { title: title });
        });
        this.getOverview = (0, catchAsync_1.default)(async (req, res, next) => {
            const title = 'Over View page';
            const tours = await this.tourQuery.getAllTour();
            // console.log(tours)
            res.status(200).render('overview', { title: title, tours: tours });
        });
        this.tourQuery = new tourQuery_1.default();
        this.userQuery = new userQuery_1.default();
    }
}
exports.default = viewController;
