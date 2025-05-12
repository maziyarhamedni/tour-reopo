import { PrismaClient } from '@prisma/client';
import { PaymentResponse } from '../utils/express';
import { connect } from 'http2';
import { orderStatus } from '@prisma/client';

const prisma = new PrismaClient();

class OrderQuery {
  order;
  prisma;

  constructor() {
    this.order = prisma.order;
    this.prisma = prisma;
  }

  addOrderToUser = async (userid: string, tourid: string) => {
    const order = await this.order.create({
      data: {
        tourId: tourid,
        userId: userid,
        status: orderStatus.pending,
      },
      
    });

    return order ? order : false;
  };

  findOrderByUserId = async (userid: string) => {
    const orders = await this.order.findMany({
      where: {
        userId: userid,
      },
    });

    return orders ? orders : false;
  };
}

export default OrderQuery;
