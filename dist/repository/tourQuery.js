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
const tourModel_1 = __importDefault(require("../models/tourModel"));
class TourQuery {
    constructor() {
        this.createTour = (data) => __awaiter(this, void 0, void 0, function* () {
            // console.log(data);
            const newTour = yield this.model.tour.create({
                data: {
                    name: data.name,
                    // slug: data.slug,
                    duration: data.duration,
                    maxGroupSize: data.maxGroupSize,
                    difficulty: data.difficulty,
                    ratingsAverage: data.ratingsAverage,
                    ratingsQuantity: data.ratingsQuantity,
                    price: data.price,
                    priceDiscount: data.priceDiscount,
                    summary: data.summary,
                    description: data.description,
                    imageCover: data.imageCover,
                    images: data.images,
                    createdAt: new Date(),
                    startDates: data.startDates,
                },
            });
            return newTour;
        });
        this.createStartLocation = (data) => __awaiter(this, void 0, void 0, function* () {
            console.log(data.coordinates);
            const newStartLoc = yield this.model.tour.update({
                where: { id: data.tourId }, // Specify the tour you want to update
                data: {
                    startLocation: {
                        connectOrCreate: {
                            where: {
                                // Specify unique fields to find an existing location, if applicable
                                tourId: data.tourId,
                            },
                            create: {
                                // Create a new start location if it doesn't exist
                                description: data.description,
                                type: data.type,
                                coordinates: { set: data.coordinates },
                                address: data.address,
                            },
                        },
                    },
                },
            });
            return newStartLoc;
        });
        this.createLocation = (data) => __awaiter(this, void 0, void 0, function* () {
            const newLocation = yield this.model.tour.update({
                where: { id: data.tourId },
                data: {
                    locations: {
                        create: {
                            day: data.day,
                            description: data.description,
                            address: data.address,
                            coordinates: { set: data.coordinates },
                            type: data.type,
                        },
                    },
                },
            });
            return newLocation;
        });
        this.findTourById = (id) => __awaiter(this, void 0, void 0, function* () {
            const tour = yield this.model.tour.findUnique({
                where: {
                    id: id,
                },
                include: {
                    startLocation: true,
                    locations: {
                        omit: {
                            tourId: true,
                        },
                    },
                    guides: {
                        select: {
                            id: true,
                            name: true,
                            lastName: true,
                            role: true,
                        },
                    },
                },
            });
            return tour;
        });
        this.findTourByName = (name) => __awaiter(this, void 0, void 0, function* () {
            const tour = yield this.model.tour.findUnique({
                where: {
                    name: name
                },
                include: {
                    startLocation: true,
                    guides: true,
                    locations: true,
                    reviews: {
                        include: {
                            user: {
                                omit: {
                                    password: true,
                                    passwordChengeAt: true,
                                    resetPassword: true,
                                    passwordConfrim: true
                                }
                            }
                        }
                    }
                }
            });
            return tour;
        });
        this.getAllTour = () => __awaiter(this, void 0, void 0, function* () {
            const tours = yield this.model.tour.findMany({
                include: {
                    startLocation: true,
                    guides: true,
                    locations: true
                }
            });
            return tours;
        });
        this.updateTour = (id, data) => __awaiter(this, void 0, void 0, function* () {
            yield this.model.tour.update({
                where: { id: id },
                data,
            });
        });
        this.deleteTour = (id) => __awaiter(this, void 0, void 0, function* () {
            yield this.model.tour.delete({
                where: {
                    id: id,
                },
            });
        });
        this.addTourGuide = (tourId, userIds) => __awaiter(this, void 0, void 0, function* () {
            const guide = yield this.model.tour.update({
                where: {
                    id: tourId,
                },
                data: {
                    guides: {
                        connect: userIds.map((userId) => ({ id: userId })),
                    },
                },
            });
            return guide;
        });
        this.tourWhiten = (radius, lat, lng) => __awaiter(this, void 0, void 0, function* () {
            // const toursWithinRadiuds = await this.model.startLocation.findMany({  
            //   where: {  
            //     // Using a raw filtering condition for geospatial query  
            //     AND: [  
            //       {  
            //         // Use ST_DWithin to find locations within the radius  
            //         coordinates: {  
            //           has :area.prisma.$executeRaw`ST_DWithin(  
            //             ST_MakePoint(${lng}, ${lat})::geography,  
            //             ST_MakePoint(coordinates[0], coordinates[1])::geography,  
            //             ${radius * 1000} 
            //           )`  
            //         }  
            //       }  
            //     ]  
            //   },  
            //   include: {  
            //     tour: true, // Include associated tour data  
            //   },  
            // });  
            const toursWithinRadius = yield this.prisma.$queryRaw `  
    SELECT sl.*, t.*  
    FROM "StartLocation" sl  
    JOIN "Tour" t ON sl."tourId" = t.id  
    WHERE ST_DWithin(  
      ST_MakePoint(${lng}, ${lat})::geography,  
      ST_MakePoint(sl."coordinates"[0], sl."coordinates"[1])::geography,  
      ${radius * 1000} 
    );  
  `;
            return toursWithinRadius;
        });
        this.model = new tourModel_1.default();
        this.prisma = this.model.prisma;
    }
}
module.exports = TourQuery;
