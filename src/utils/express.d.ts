// express.d.ts
import { Request } from 'express';
import { NewUser } from './dataStructure';
import { Difficulty, Order, Role } from '@prisma/client';
interface NewUser {
  id: string;
  name: string;
  email: string;
  lastName: string;
  photo: string;
  password: string;
  passwordConfrim?: string;
  passwordChengeAt: Date;
  role: Role;
  isActive: boolean;
  order: Order[];
}

interface Order {
  id?: string;
  userId: string;
  tourId: string;
  finalPrice: Int;
  count: Int;
  status?: orderStatus;
  paymentId?: string;
}
interface PaymentResponse {
  data: {
    code: number;
    message: string;
    card_hash: string;
    card_pan: string;
    ref_id: number;
  };
}
interface UserSafeInfo {
  id: string;
  name: string;
  email: string;
  lastName: string;
  photo: string;
  role?: Role;
}

interface Location {
  tourId: string; // Foreign key to connect with Tour   @unique @unique
  type: string;
  coordinates: number[];
  address: string?;
  description: string?;
  day: number;
}

interface ReviewField {
  id: string;
  review: string;
  rating: Int;
  createdAt: Date;
  userId: string;
  tourId: string;
}

interface EmailOption {
  message: string;
  email: string;
  subject: string;
}
declare module 'express' {
  interface Request {
    user?: NewUser;
    order?: {
      count: string;
      userId: string;
      tourId: string;
      price: number;
    };
  }
}
declare module 'axios' {
  import axios from 'axios';
  export = axios;
}

interface StartLocation {
  id: string;
  description: string; // Description of the start location
  type: string; // Type of location (e.g., "Point")
  coordinates: number[]; // Array of coordinates [longitude, latitude]
  address: string; // Full address of the start location
  tourId: string;
}
interface Payload {
  id: string;
  iat: number;
}
interface Tour {
  name: string;
  slug?: string;
  duration: number;
  maxGroupSize: number;
  difficulty: Difficulty;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount: number?;
  summary: string;
  description: string?;
  imageCover: string;
  images: string[];
  createdAt: Date;
  startDates: Date[];
  secretTour: Boolean;
  // startLocation: StartLocation?;
  // locations: Location[];
}
