import Repository from '../repository/repository';
import bcrypt from 'bcrypt';
// import { NextFunction } from 'express';



const repository = new Repository();
class UserService {
  user;

  constructor() {
    this.user = repository.user;
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

export = UserService;
