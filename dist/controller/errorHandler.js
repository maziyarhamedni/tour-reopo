import AppError from '../utils/AppError';
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};
const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);
const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);
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
