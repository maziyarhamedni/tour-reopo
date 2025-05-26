"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const repository_1 = __importDefault(require("./repository"));
class TourQuery extends repository_1.default {
    constructor() {
        super();
        this.createTour = async (data) => {
            const newTour = await this.tour.create({
                data: {
                    name: data.name,
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
            const newStartLoc = await this.tour.update({
                where: { id: data.tourId },
                data: {
                    startLocation: {
                        connectOrCreate: {
                            where: {
                                tourId: data.tourId,
                            },
                            create: {
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
            const newLocation = await this.tour.update({
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
            const tour = await this.tour.findUnique({
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
                            photo: true
                        },
                    },
                },
            });
            return tour;
        };
        this.findTourByName = async (name) => {
            const tour = await this.tour.findUnique({
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
                                }
                            }
                        }
                    }
                }
            });
            return tour;
        };
        this.getAllTour = async () => {
            const tours = await this.tour.findMany({
                include: {
                    startLocation: true,
                    guides: true,
                    locations: true
                }
            });
            return tours;
        };
        this.updateTour = async (id, data) => {
            await this.tour.update({
                where: { id: id },
                data,
            });
            const updateTour = await this.findTourById(id);
            return updateTour;
        };
        this.deleteTour = async (id) => {
            await this.tour.delete({
                where: {
                    id: id,
                },
            });
        };
        this.addTourGuide = async (tourId, userIds) => {
            const guide = await this.tour.update({
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
    }
}
module.exports = TourQuery;
