"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UnitOfWork {
    constructor() {
        this.execute = async (work) => {
            const result = await this.db.$transaction(async (action) => {
                return await work(action);
            });
            return result;
        };
        this.disconnec = async () => {
            await this.db.$disconnect();
        };
        this.db = prisma;
    }
}
exports.default = UnitOfWork;
