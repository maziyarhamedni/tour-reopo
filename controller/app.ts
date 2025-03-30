import rateLimit from 'express-rate-limit';
import express, { Request, Response, NextFunction } from 'express';
import tourRouter from '../router/tourRouter';
import userRouter from '../router/userRouter';
import morgan from 'morgan';
import helmet from 'helmet';
import AppError from '../utils/AppError';
import reviewRouter from '../router/reviewRouter';
import errorHandler from './errorHandler';
const app = express();
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
if (process.env.NODE_ENV == 'development') app.use(morgan('dev'));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many requests from this IP , please try again an hour!',
});

app.use(express.static(`${__dirname}/public`));
app.use('/api', limiter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);
export = app;
