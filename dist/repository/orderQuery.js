"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class OrderQuery {
    constructor() {
        this.addOrder = async (data) => {
            const order = await this.order.create({
                data: {
                    tourId: data.tourId,
                    userId: data.userId,
                    status: client_2.orderStatus.pending,
                    price: data.price,
                    count: data.count
                },
            });
            return order ? order : false;
        };
        this.findOrderByUserId = async (userid) => {
            const orders = await this.order.findMany({
                where: {
                    userId: userid,
                },
            });
            return orders ? orders : false;
        };
        this.findOrderById = async (orderId) => {
            const order = await this.order.findUnique({
                where: {
                    id: orderId,
                },
            });
            return order || false;
        };
        this.order = prisma.order;
        this.prisma = prisma;
    }
}
exports.default = OrderQuery;
