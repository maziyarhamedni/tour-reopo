"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import TourQuery from '../repository/tourQuery';
const AppError_1 = __importDefault(require("../utils/AppError"));
const tourService_1 = __importDefault(require("../service/tourService"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
class TourController {
    constructor() {
        this.getAllTours = (0, catchAsync_1.default)(async (req, res, next) => {
            const tours = await this.service.getAllTours();
            if (!tours) {
                return next(new AppError_1.default('crush an api and cant get all tour', 404));
            }
            res.status(200).json(tours);
        });
        this.createTour = (0, catchAsync_1.default)(async (req, res, next) => {
            const data = await req.body;
            const tour = await this.service.createTour(data);
            if (!tour) {
                return next(new AppError_1.default('cant make a tour to database', 403));
            }
            res.status(201).json(tour);
        });
        this.getTour = (0, catchAsync_1.default)(async (req, res, next) => {
            const id = req.params.id;
            const tour = await this.service.getTour(id);
            if (!tour) {
                return next(new AppError_1.default('please inter id of tour', 404));
            }
            res.status(200).json(tour);
        });
        this.updateTour = (0, catchAsync_1.default)(async (req, res, next) => {
            const id = req.params.id;
            const data = req.body;
            const updateTour = this.service.updateTour(id, data);
            if (!updateTour) {
                return next(new AppError_1.default('thers isnot tour whit this id', 404));
            }
            res.status(200).json(updateTour);
        });
        this.deleteTour = (0, catchAsync_1.default)(async (req, res, next) => {
            const id = req.params.id;
            if (!id) {
                return next(new AppError_1.default('please inter id of tour', 404));
            }
            res.status(204).send(`tour with id ${id}deleted `);
        });
        this.addStartLoc = (0, catchAsync_1.default)(async (req, res, next) => {
            const id = req.params.id;
            const data = req.body;
            data.tourId = id;
            const newStartLoc = await this.service.addStartLoc(id, data);
            if (!newStartLoc) {
                return next(new AppError_1.default('please inter start location', 404));
            }
            res.status(201).json(newStartLoc);
        });
        this.addLoc = (0, catchAsync_1.default)(async (req, res, next) => {
            const id = req.params.id;
            const data = req.body;
            data.tourId = id;
            const newLoc = await this.service.addLoc(id, data);
            if (!newLoc) {
                return next(new AppError_1.default('please inter start location', 404));
            }
            res.status(201).json(newLoc);
        });
        // tourWhitn = catchAsync(
        //   async (req: Request, res: Response, next: NextFunction) => {
        //     const { distance, latlng, unit } = req.params;
        //     const [lat, lng] = latlng.split(',');
        //     if (!lat || !lng) {
        //       next(
        //         new AppError(
        //           'please provide latiutr and logitude in th format lat,len',
        //           400
        //         )
        //       );
        //     }
        //     const disNum = Number(distance);
        //     const newLat = Number(lat);
        //     const newLng = Number(lng);
        //     const radius = unit == 'mi' ? disNum / 3963.2 : disNum / 6378.1;
        //     const tours = await this.query.tourWhiten(radius, newLat, newLng);
        //     res.status(200).json({
        //       status: 'success',
        //       tours
        //     });
        //   }
        // );
        this.addTourGuides = (0, catchAsync_1.default)(async (req, res, next) => {
            const id = req.params.id;
            const guides = req.body.guides;
            const guide = await this.service.addTourGuides(id, guides);
            if (!guide) {
                return next(new AppError_1.default('shit', 404));
            }
            res.status(201).json(guide);
        });
        this.service = new tourService_1.default();
    }
}
exports.default = TourController;
////////
// https://sandbox.zarinpal.com/pg/v4/payment/request.json
// https://sandbox.zarinpal.com/pg/v4/payment/verify.json
// https://sandbox.zarinpal.com/pg/StartPay/
