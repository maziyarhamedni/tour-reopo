"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const tourModel_1 = __importDefault(require("../models/tourModel"));
class TourQuery {
    constructor() {
        this.createTour = async (data) => {
            // console.log(data);
            const newTour = await this.model.tour.create({
                data: {
                    name: data.name,
                    slug: data.slug,
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
        };
        this.createStartLocation = async (data) => {
            console.log(data.coordinates);
            const newStartLoc = await this.model.tour.update({
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
        };
        this.createLocation = async (data) => {
            const newLocation = await this.model.tour.update({
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
        };
        this.findTourById = async (id) => {
            const tour = await this.model.tour.findUnique({
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
        };
        this.getAllTour = async () => {
            const tours = await this.model.tour.findMany({
                include: {
                    startLocation: true,
                    guides: true,
                    locations: true
                }
            });
            return tours;
        };
        this.updateTour = async (id, data) => {
            await this.model.tour.update({
                where: { id: id },
                data,
            });
        };
        this.deleteTour = async (id) => {
            await this.model.tour.delete({
                where: {
                    id: id,
                },
            });
        };
        this.addTourGuide = async (tourId, userIds) => {
            const guide = await this.model.tour.update({
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
        };
        this.tourWhiten = async (radius, lat, lng) => {
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
            const toursWithinRadius = await this.prisma.$queryRaw `  
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
        };
        this.model = new tourModel_1.default();
        this.prisma = this.model.prisma;
    }
}
module.exports = TourQuery;
