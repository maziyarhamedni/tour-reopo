// express.d.ts
import { Request } from 'express';
import { NewUser } from './dataStructure';
import { Difficulty, Role } from '@prisma/client';
interface NewUser {
  resetPassword: string;
  id: string;
  name: string;
  email: string;
  lastName: string;
  password: string;
  passwordConfrim: string;
  passwordChengeAt: Date;
  role: Role;
  resetPassword: string;
  expiredTime: string; 
  isActive: boolean;
}

interface Location{
  tourId  :    string // Foreign key to connect with Tour   @unique @unique
  type     :   string
  coordinates :number[] // array of numbers for coordinates  
  address   :  string?,
  description: string?,
  day   :     number
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
  }
}

interface StartLocation {
  id: string;
  description: string; // Description of the start location
  type: string; // Type of location (e.g., "Point")
  coordinates: number[]; // Array of coordinates [longitude, latitude]
  address: string; // Full address of the start location
  tourId: string;
 
}

interface Tour {
  name: string;
  slug: string?;
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


