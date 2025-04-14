import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
class Repository {
  review;
  tour;
  user;
  prisma;

  constructor() {
    this.tour = prisma.tour;
    this.review = prisma.review;
    this.user = prisma.user;
    this.prisma = prisma
  }
}

export default Repository;
