"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const viewController_1 = __importDefault(require("../controller/viewController"));
const authController_1 = __importDefault(require("../controller/authController"));
const viewRouter = express_1.default.Router();
const authorize = new authController_1.default();
const viewControl = new viewController_1.default;
// viewRouter.use(authorize.isLoggedIn)
viewRouter.get('/', authorize.isLoggedIn, viewControl.getOverview);
viewRouter.get('/tour/:slug', authorize.isLoggedIn, viewControl.getTour);
viewRouter.get('/login', authorize.isLoggedIn, viewControl.getLoginform);
exports.default = viewRouter;
