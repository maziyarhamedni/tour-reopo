"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const AppError_1 = __importDefault(require("../utils/AppError"));
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError_1.default(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError_1.default(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError_1.default(message, 400);
};
const handleJWTError = () => new AppError_1.default('Invalid token. Please log in again!', 401);
const handleJWTExpiredError = () => new AppError_1.default('Your token has expired! Please log in again.', 401);
const sendErrorDev = (err, res) => {
    if (err.code == 'P2002') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: `you repeat same thing on model <<<${err.meta.modelName}>>>  on  <<<${err.meta.target.map((el) => el)}>>> filed`,
        });
    }
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
const sendPreventDuplicateError = (err, res) => {
    if (err.code == 'P2002') {
        res.status(500).json({
            status: err.status,
            message: 'you repeat your mission again you just can doit one time sorry :( ',
        });
    }
};
const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
        // Programming or other unknown error: don't leak error details
    }
    else {
        // 1) Log error
        console.error('ERROR 💥', err);
        // 2) Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }
};
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        // if (err.code == 'P2002') sendPreventDuplicateError(err, res);
        sendErrorDev(err, res);
    }
    else if (process.env.NODE_ENV === 'production') {
        let error = Object.assign({}, err);
        if (error.name === 'CastError')
            error = handleCastErrorDB(error);
        if (error.code === 11000)
            error = handleDuplicateFieldsDB(error);
        if (error.code == 'P2002')
            error = sendPreventDuplicateError(error, res);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError')
            error = handleJWTError();
        if (error.name === 'TokenExpiredError')
            error = handleJWTExpiredError();
        sendErrorProd(error, res);
    }
};
