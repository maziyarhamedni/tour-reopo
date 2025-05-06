import OrderQuery from '../repository/orderQuery';
import { PaymentResponse } from '../utils/express';
import TourQuery from '../repository/tourQuery';
class OrderService {
  orderQuery;
  tourQuery;

  constructor() {
    this.orderQuery = new OrderQuery();
    this.tourQuery = new TourQuery();
  }

  createOrder = async (
    tourid: string,
    userid: string,
    price: number,
    data: PaymentResponse
  ) => {
    const tour = await this.tourQuery.findTourById(tourid);
    if (tour) {
      const count = tour?.price / price;
      
      const order = await this.orderQuery.addOrderToUser(
        userid,
        tourid,
        count,
        tour.startDates[0],
        data
      );
      //delete tedatourda karbar
      const group = tour.maxGroupSize - count;
      await this.tourQuery.updateTour(tourid, { maxGroupSize: group });
      return order ? order : false;
    }
  };

  getOrderbyUserId = async (userId: string) => {
    const orders = await this.orderQuery.findOrderByUserId(userId);

    return orders ? orders : false;
  };
}

export default OrderService;
