import { PrismaClient } from '@prisma/client';
import { PaymentResponse } from '../utils/express';
import { connect } from 'http2';

const prisma = new PrismaClient();

class OrderQuery {
  order;
  prisma;

  constructor() {
    this.order = prisma.order;
    this.prisma = prisma;
  }

  addOrderToUser = async (
    userid: string,
    tourid: string,
    count: number,
    tourTime:Date,
    data: PaymentResponse
  ) => {


   const order = await this.order.create({
     data:{
      tourId: tourid,
      tourTime:tourTime,
      count:count,
      userId: userid,
      transactionId: data.data.ref_id,
      cardHash:data.data.card_hash
     }
 
    });
    

    return order?order:false
  };



  findOrderByUserId = async (userid:string)=>{
      

    const orders = await this.order.findMany({
      where:{
        userId:userid
      }
    })


    return orders?orders:false
  }

}

export default OrderQuery;
