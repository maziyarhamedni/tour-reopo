"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_1 = __importDefault(require("express"));
const tourRouter_1 = __importDefault(require("../router/tourRouter"));
const userRouter_1 = __importDefault(require("../router/userRouter"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const reviewRouter_1 = __importDefault(require("../router/reviewRouter"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
if (process.env.NODE_ENV == 'development')
    app.use((0, morgan_1.default)('dev'));
const limiter = (0, express_rate_limit_1.default)({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'too many requests from this IP , please try again an hour!',
});
app.use(express_1.default.static(`${__dirname}/public`));
app.use('/api', limiter);
app.use('/api/v1/tours', tourRouter_1.default);
app.use('/api/v1/users', userRouter_1.default);
app.use('/api/v1/reviews', reviewRouter_1.default);
app.all('*', (req, res, next) => {
    next(new AppError_1.default(`Can't find ${req.originalUrl} on this server!`, 404));
});
module.exports = app;
