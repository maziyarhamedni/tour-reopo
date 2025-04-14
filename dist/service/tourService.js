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
class TourService {
    constructor() {
        this.getAllTours = () => __awaiter(this, void 0, void 0, function* () {
            const tours = yield this.tourQuery.getAllTour();
            return tours ? tours : false;
        });
        this.createTour = (data) => __awaiter(this, void 0, void 0, function* () {
            const tour = yield this.tourQuery.createTour(data);
            return !tour ? false : tour;
        });
        this.getTour = (id) => __awaiter(this, void 0, void 0, function* () {
            const tour = yield this.tourQuery.findTourById(id);
            return tour ? tour : false;
        });
        this.updateTour = (id, data) => __awaiter(this, void 0, void 0, function* () {
            const updataTour = yield this.tourQuery.updateTour(id, data);
            return updataTour ? updataTour : false;
        });
        this.deleteTour = (id) => __awaiter(this, void 0, void 0, function* () {
            const tour = yield this.tourQuery.findTourById(id);
            if (tour) {
                yield this.tourQuery.deleteTour(id);
            }
            return false;
        });
        this.addStartLoc = (tourId, data) => __awaiter(this, void 0, void 0, function* () {
            const newStartLoc = yield this.tourQuery.createStartLocation(data);
            return !newStartLoc ? false : newStartLoc;
        });
        this.addLoc = (id, data) => __awaiter(this, void 0, void 0, function* () {
            data.tourId = id;
            const newLoc = yield this.tourQuery.createLocation(data);
            return !newLoc ? false : newLoc;
        });
        this.addTourGuides = (id, guides) => __awaiter(this, void 0, void 0, function* () {
            const guide = yield this.tourQuery.addTourGuide(id, guides);
            return !guide ? false : guide;
        });
        this.tourQuery = new tourQuery_1.default();
    }
}
exports.default = TourService;
