import { Tour } from '../utils/express';
import TourQuery from '../repository/tourQuery';
import { StartLocation, Location } from '.prisma/client';

class TourService {
  tourQuery;

  constructor() {
    this.tourQuery = new TourQuery();
  }

  getAllTours = async () => {
    const tours = await this.tourQuery.getAllTour();
    return tours ? tours : false;
  };

  createTour = async (data: Tour) => {
    const tour = await this.tourQuery.createTour(data);
    return !tour ? false : tour;
  };

  getTour = async (id: string) => {
    const tour = await this.tourQuery.findTourById(id);
    return tour ? tour : false;
  };

  updateTour = async (id: string, data: Tour) => {
    const updataTour = await this.tourQuery.updateTour(id, data);

    return updataTour ? updataTour : false;
  };

  deleteTour = async (id: string) => {
    const tour = await this.tourQuery.findTourById(id);
    if (tour) {
      await this.tourQuery.deleteTour(id);
    }

    return false;
  };

  addStartLoc = async (tourId: string, data: StartLocation) => {
    const newStartLoc = await this.tourQuery.createStartLocation(data)!;
    return !newStartLoc ? false : newStartLoc;
  };

  addLoc = async (id: string, data: any) => {
    data.tourId = id;
    const newLoc = await this.tourQuery.createLocation(data)!;
    return !newLoc ? false : newLoc;
  };

  addTourGuides = async (id: string, guides: string[]) => {
    const guide = await this.tourQuery.addTourGuide(id, guides);
    return !guide ? false : guide;
  };
}

export default TourService;
