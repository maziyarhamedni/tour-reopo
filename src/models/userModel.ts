import prisma from './model';
import bcrypt from 'bcrypt';
// import { NextFunction } from 'express';

class UserModel {
  user;

  constructor() {
    this.user = prisma.user;
  }

  async passwordChenged(jwtIat: any, passChenge: Date): Promise<Boolean> {
    const passChengeAt = parseInt(`${passChenge.getTime() / 1000}`, 10);
    return passChengeAt > jwtIat;
  }

  async correctPassword(password: string, hashedPassword: string | null) {
    if (hashedPassword) {
      return await bcrypt.compare(password, hashedPassword);
    }
  }
}

export = UserModel;
