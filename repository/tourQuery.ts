import { tour } from '../models/model';
import TourModel from '../models/tourModel';
import catchAsync from '../utils/catchAsync';
import { Tour } from './../utils/express';
import { StartLocation, Location } from './../utils/express';

class TourQuery {
  model;

  constructor() {
    this.model = new TourModel();
  }

  createTour = async (data: Tour) => {
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

  createStartLocation = async (data: StartLocation) => {
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

  createLocation = async (data: Location) => {
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

  findTourById = async (id: string) => {
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

  getAllTour = async () => {
    const tours = await this.model.tour.findMany();
    return tours;
  };

  updateTour = async (id: string, data: {}) => {
    await this.model.tour.update({
      where: { id: id },
      data,
    });
  };

  deleteTour = async (id: string) => {
    await this.model.tour.delete({
      where: {
        id: id,
      },
    });
  };

  addTourGuide = async (tourId: string, userIds: string[]) => {
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
}

export = TourQuery;
