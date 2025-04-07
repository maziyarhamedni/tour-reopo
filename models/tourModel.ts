import prisma from './model';

class TourModel {
  tour;
  startLocation;
  location;
  prisma;

   
  constructor() {
    this.tour = prisma.tour;
    this.startLocation = prisma.startLocation;
    this.location = prisma.location;
    this.prisma = prisma;
  

  }
}

export = TourModel;
