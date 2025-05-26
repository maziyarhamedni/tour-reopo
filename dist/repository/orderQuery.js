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
                    finalPrice: data.finalPrice,
                    count: data.count,
                },
            });
            return order || false;
        };
        this.findOrderByUserId = async (userid) => {
            const orders = await this.order.findMany({
                where: {
                    userId: userid,
                },
            });
            return orders || false;
        };
        this.transAction = async (orderId, data, updateOrderStatus, createTrx) => {
            await this.prisma.$transaction(async (tx) => {
                await updateOrderStatus(orderId, tx);
                await createTrx(data, tx);
            });
        };
        this.findTrxByOrderId = async (trxId) => {
            const trx = await this.trx.findUnique({
                where: {
                    id: trxId,
                },
                include: {
                    order: true,
                },
            });
            return trx || false;
        };
        this.updateOrderStatus = async (orderId, tx) => {
            await tx.order.update({
                where: {
                    id: orderId,
                },
                data: {
                    status: 'paid',
                },
            });
        };
        this.createTrx = async (data, tx) => {
            const trx = await tx.payment.create({
                data: {
                    card_hash: data.card_hash,
                    card_pan: data.card_pan,
                    code: data.code,
                    fee: data.fee,
                    fee_type: data.fee_type,
                    ref_id: data.ref_id,
                    orderId: data.order_id,
                },
            });
            return trx || false;
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
        this.trx = prisma.payment;
    }
}
exports.default = OrderQuery;
