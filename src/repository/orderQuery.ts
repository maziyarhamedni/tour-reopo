import { PrismaClient } from '@prisma/client';
import { orderStatus } from '@prisma/client';
import { Order } from '../utils/express';
const prisma = new PrismaClient();

class OrderQuery {
  order;
  prisma;

  constructor() {
    this.order = prisma.order;
    this.prisma = prisma;
  }

  addOrder = async (data:Order) => {


    const order = await this.order.create({
      data: {
        tourId: data.tourId,
        userId: data.userId,
        status: orderStatus.pending,
        price:data.price,
        count:data.count
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
