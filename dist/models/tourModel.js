import prisma from './model';
class TourModel {
    constructor() {
        this.tour = prisma.tour;
        this.startLocation = prisma.startLocation;
        this.location = prisma.location;
        this.prisma = prisma;
    }
}
export default TourModel;
