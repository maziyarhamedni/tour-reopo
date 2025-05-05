"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class OrderQuery {
    constructor() {
        this.addOrderToUser = async (userid, tourid, count, tourTime, data) => {
            const order = await this.order.create({
                data: {
                    tourId: tourid,
                    tourTime: tourTime,
                    count: count,
                    userId: userid,
                    transactionId: data.data.ref_id,
                    cardHash: data.data.card_hash
                }
            });
            return order ? order : false;
        };
        this.findOrderByUserId = async (userid) => {
            const orders = await this.order.findMany({
                where: {
                    userId: userid
                }
            });
            return orders ? orders : false;
        };
        this.order = prisma.order;
        this.prisma = prisma;
    }
}
exports.default = OrderQuery;
