import OrderQuery from '../repository/orderQuery';
import TourQuery from '../repository/tourQuery';

class OrderService {
  orderQuery;
  tourQuery;

  constructor() {
    this.orderQuery = new OrderQuery();
    this.tourQuery = new TourQuery();
  }

  sentTourPrice = async (tourId: string) => {
    const tour = await this.tourQuery.findTourById(tourId);
    const price = tour?.price;
    return tour ? price : false;
  };
  createOrder = async (tourId:string,userId:string,count:number) => {
    const tour = await this.tourQuery.findTourById(tourId);
  
    if (tour) {
      const finalPrice = count * tour.price;
      const data = {tourId,userId,count,finalPrice}
      const order = await this.orderQuery.addOrder(data);
      return order || false;
    }
  };
  getOrderById = async(orderId:string)=>{

    const orders = await this.orderQuery.findOrderById(orderId);
    return orders || false;
  }

  getOrderbyUserId = async (userId: string) => {
    const orders = await this.orderQuery.findOrderByUserId(userId);
    return orders || false;
  };
}

export default OrderService;
