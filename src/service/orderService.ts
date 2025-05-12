import OrderQuery from '../repository/orderQuery';
import TourQuery from '../repository/tourQuery';

class OrderService {
  orderQuery;
  tourQuery;

  constructor() {
    this.orderQuery = new OrderQuery();
    this.tourQuery = new TourQuery();
  }

  findOrderForUser = async (orderId: string) => {
    const order = await this.orderQuery.findOrderById(orderId);
    return order ? order : false;
  };

  sentTourPrice = async (tourId: string) => {
    const tour = await this.tourQuery.findTourById(tourId);
    const price = tour?.price;
    return tour ? price : false;
  };
  createOrder = async (tourId:string,userId:string,count:number) => {
    const tour = await this.tourQuery.findTourById(tourId);
  
    if (tour) {
      const price = count * tour.price
      const data = {tourId,userId,price,count}
      const order = await this.orderQuery.addOrder(data);
      return order ? order : false;
    }
  };

  getOrderbyUserId = async (userId: string) => {
    const orders = await this.orderQuery.findOrderByUserId(userId);
    return orders ? orders : false;
  };
}

export default OrderService;
