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

  createOrder = 
  async (tourid: string,userid: string,price: number,data: PaymentResponse ) => {


    const tour = await this.tourQuery.findTourById(tourid);
    if (tour) {
      const count = (tour?.price / price);
      console.log(`tour price is ${tour.price} and user paid ${price}`)
      const order = await this.orderQuery.addOrderToUser(
        userid,
        tourid,
        count,
        tour.startDates[0],
        data
      );
      return order ? order : false;

    }
  };
}

export default OrderService;
