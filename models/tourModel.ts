import prisma from './model';

class TourModel {
  tour;
  startLocation;
  location;
  
  constructor() {
    this.tour = prisma.tour;
    this.startLocation = prisma.startLocation;
    this.location = prisma.location;

  }
}

export = TourModel;
