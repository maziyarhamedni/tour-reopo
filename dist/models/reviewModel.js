import prisma from './model';
class ReviewModel {
    constructor() {
        this.tour = prisma.tour;
        this.review = prisma.review;
        this.user = prisma.user;
    }
}
export default ReviewModel;
