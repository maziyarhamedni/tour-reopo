import prisma from './model';

class ReviewModel {
  review;
  tour;
  user;

  constructor() {
    this.tour = prisma.tour;
    this.review = prisma.review;
    this.user = prisma.user;
  }
}

export default ReviewModel;
