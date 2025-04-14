"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class Repository {
    constructor() {
        this.tour = prisma.tour;
        this.review = prisma.review;
        this.user = prisma.user;
        this.prisma = prisma;
    }
}
exports.default = Repository;
