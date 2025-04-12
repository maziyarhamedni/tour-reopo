"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tourQuery_1 = __importDefault(require("../repository/tourQuery"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
class TourController {
    constructor() {
        this.getAllTours = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const tours = yield this.query.getAllTour();
            res.status(200).json(tours);
        }));
        this.createTour = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const data = yield req.body;
            // console.log('>>>>>>>>>>>>>>>>>>');
            const tour = yield this.query.createTour(data);
            if (!tour) {
                return next(new AppError_1.default('cant make a tour to database', 403));
            }
            res.status(201).json(tour);
            // next()
        }));
        this.getTour = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const tour = yield this.query.findTourById(id);
            if (!tour) {
                return next(new AppError_1.default('please inter id of tour', 404));
            }
            res.status(200).json(tour);
        }));
        this.updateTour = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            if (!id) {
                return next(new AppError_1.default('please inter id of tour', 404));
            }
            console.log(id);
            res.json(req.body);
        }));
        this.deleteTour = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            if (!id) {
                return next(new AppError_1.default('please inter id of tour', 404));
            }
            res.status(204).send(`tour with id ${id}deleted `);
        }));
        this.addStartLoc = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const data = req.body;
            data.tourId = id;
            const newStartLoc = yield this.query.createStartLocation(data);
            if (!newStartLoc) {
                return next(new AppError_1.default('please inter start location', 404));
            }
            res.status(201).json(newStartLoc);
        }));
        this.addLoc = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const data = req.body;
            data.tourId = id;
            const newLoc = yield this.query.createLocation(data);
            if (!newLoc) {
                return next(new AppError_1.default('please inter start location', 404));
            }
            res.status(201).json(newLoc);
        }));
        this.tourWhitn = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { distance, latlng, unit } = req.params;
            const [lat, lng] = latlng.split(',');
            if (!lat || !lng) {
                next(new AppError_1.default('please provide latiutr and logitude in th format lat,len', 400));
            }
            const disNum = Number(distance);
            const newLat = Number(lat);
            const newLng = Number(lng);
            const radius = unit == 'mi' ? disNum / 3963.2 : disNum / 6378.1;
            const tours = yield this.query.tourWhiten(radius, newLat, newLng);
            res.status(200).json({
                status: 'success',
                tours
            });
        }));
        this.addTourGuides = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const guides = req.body.guides;
            const guide = yield this.query.addTourGuide(id, guides);
            if (!guide) {
                return next(new AppError_1.default('shit', 404));
            }
            res.status(201).json(guide);
        }));
        this.query = new tourQuery_1.default();
    }
}
exports.default = TourController;
