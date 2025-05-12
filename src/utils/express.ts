import { orderStatus } from '@prisma/client';

export interface Order {
  id?: string;
  tourId: string;
  userId: string;
  price: number;
  count: number;
  status?: orderStatus;
}
