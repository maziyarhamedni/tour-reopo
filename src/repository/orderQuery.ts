import { PrismaClient } from '@prisma/client';
import { orderStatus } from '@prisma/client';
import { Order } from '../utils/express';
import { SuccessTrxData } from '../utils/express';
const prisma = new PrismaClient();

class OrderQuery {
  order;
  trx;
  prisma;

  constructor() {
    this.order = prisma.order;
    this.prisma = prisma;
    this.trx = prisma.payment;
  }

  addOrder = async (data: Order) => {
    const order = await this.order.create({
      data: {
        tourId: data.tourId,
        userId: data.userId,
        status: orderStatus.pending,
        finalPrice: data.finalPrice,
        count: data.count,
      },
    });

    return order || false;
  };

  findOrderByUserId = async (userid: string) => {
    const orders = await this.order.findMany({
      where: {
        userId: userid,
      },
    });

    return orders || false;
  };

  findTrxByOrderId = async (trxId: string) => {
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

  createTrx = async (data: SuccessTrxData) => {
    const trx = await this.trx.create({
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
  findOrderById = async (orderId: string) => {
    const order = await this.order.findUnique({
      where: {
        id: orderId,
      },
    });

    return order || false;
  };
}

export default OrderQuery;
