import OrderQuery from '../repository/orderQuery';
import TourQuery from '../repository/tourQuery';
class OrderService {
  orderQuery;
  tourQuery;

  constructor() {
    this.orderQuery = new OrderQuery();
    this.tourQuery = new TourQuery();
  }

  createOrder = async (tourid: string, userid: string) => {
    const tour = await this.tourQuery.findTourById(tourid);
    if (tour) {
      const order = await this.orderQuery.addOrderToUser(
        userid,
        tourid,
      );
      return order ? order : false;
    }
  };

  getOrderbyUserId = async (userId: string) => {
    const orders = await this.orderQuery.findOrderByUserId(userId);

    return orders ? orders : false;
  };
}

export default OrderService;
