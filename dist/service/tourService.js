"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tourQuery_1 = __importDefault(require("../repository/tourQuery"));
class TourService {
    constructor() {
        this.getAllTours = async () => {
            const tours = await this.tourQuery.getAllTour();
            return tours ? tours : false;
        };
        this.createTour = async (data) => {
            const tour = await this.tourQuery.createTour(data);
            return !tour ? false : tour;
        };
        this.getTour = async (id) => {
            const tour = await this.tourQuery.findTourById(id);
            return tour ? tour : false;
        };
        this.updateTour = async (id, data) => {
            const updataTour = await this.tourQuery.updateTour(id, data);
            return updataTour ? updataTour : false;
        };
        this.deleteTour = async (id) => {
            const tour = await this.tourQuery.findTourById(id);
            if (tour) {
                await this.tourQuery.deleteTour(id);
            }
            return false;
        };
        this.addStartLoc = async (tourId, data) => {
            const newStartLoc = await this.tourQuery.createStartLocation(data);
            return !newStartLoc ? false : newStartLoc;
        };
        this.addLoc = async (id, data) => {
            data.tourId = id;
            const newLoc = await this.tourQuery.createLocation(data);
            return !newLoc ? false : newLoc;
        };
        this.addTourGuides = async (id, guides) => {
            const guide = await this.tourQuery.addTourGuide(id, guides);
            return !guide ? false : guide;
        };
        this.tourQuery = new tourQuery_1.default();
    }
}
exports.default = TourService;
