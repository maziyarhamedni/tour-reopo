import { PrismaClient } from '@prisma/client';
import { orderStatus } from '@prisma/client';
import { Order } from '../utils/express';
import { SuccessTrxData } from '../utils/express';

type TransactionPrsma = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

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

  transAction = async (orderId: string, data: SuccessTrxData) => {
    await this.prisma.$transaction(async (tx: TransactionPrsma) => {
      await this.updateOrderStatus(orderId, tx);
      await this.createTrx(data, tx);
    });
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

  updateOrderStatus = async (orderId: string, tx: TransactionPrsma) => {
    await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: 'paid',
      },
    });
  };

  createTrx = async (data: SuccessTrxData, tx: TransactionPrsma) => {
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
