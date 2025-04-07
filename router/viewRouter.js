"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const viewController_1 = __importDefault(require("../controller/viewController"));
const viewRouter = express_1.default.Router();
const viewControl = new viewController_1.default;
viewRouter.get('/', viewControl.getHomePage);
viewRouter.get('/overview', viewControl.getOverview);
viewRouter.get('/tour', viewControl.getTour);
exports.default = viewRouter;
