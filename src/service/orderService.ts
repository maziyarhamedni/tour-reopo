import OrderQuery from '../repository/orderQuery';
import TourQuery from '../repository/tourQuery';
import { ZarinPalPayConnction } from '../utils/express';
import axios from 'axios';
import { SuccessTrxData } from '../utils/express';
class OrderService {
  orderQuery: OrderQuery;

  tourQuery: TourQuery;
  constructor() {
    this.orderQuery = new OrderQuery();
    this.tourQuery = new TourQuery();
  }

  connctionWithZainPal = async (url: string, data: ZarinPalPayConnction) => {
    try {
      const response = await axios.post(url, data, {
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
      });
      return await response.data;
    } catch (error) {
      const axiosError = error as { response?: { data: any }; message: string };
      console.error(
        'Error:',
        axiosError.response ? axiosError.response.data : axiosError.message
      );
      return false;
    }
  };

  findTrxbyOrderId = async (orderId: string) => {
    const trx = await this.orderQuery.findTrxByOrderId(orderId);
    return trx || false;
  };

  checkCode101ZarinPal = async (data: SuccessTrxData) => {
    const order = await this.orderQuery.findOrderById(data.order_id);

    if (order && order.status == 'paid') {
      return order;
    } else if (order && order.status == 'pending') {
      this.orderQuery.transAction(
        data.order_id,
        data,
        this.orderQuery.updateOrderStatus,
        this.orderQuery.createTrx
      );
    }
  };

  createTrx = async (data: SuccessTrxData) => {
    await this.orderQuery.transAction(
      data.order_id,
      data,
      this.orderQuery.updateOrderStatus,
      this.orderQuery.createTrx
    );

    console.log('trx is crate');
  };

  sentTourPrice = async (tourId: string) => {
    const tour = await this.tourQuery.findTourById(tourId);
    const price = tour?.price;
    return tour ? price : false;
  };
  createOrder = async (tourId: string, userId: string, count: number) => {
    const tour = await this.tourQuery.findTourById(tourId);

    if (tour) {
      const finalPrice = count * tour.price;
      const data = { tourId, userId, count, finalPrice };
      const order = await this.orderQuery.addOrder(data);
      return order || false;
    }
  };
  getOrderById = async (orderId: string) => {
    const orders = await this.orderQuery.findOrderById(orderId);
    return orders || false;
  };

  getOrderbyUserId = async (userId: string) => {
    const orders = await this.orderQuery.findOrderByUserId(userId);
    return orders || false;
  };
}

export default OrderService;
