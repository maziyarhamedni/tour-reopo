import Repository from './repository';
import bcryptjs from 'bcryptjs';
import { NewUser } from './../utils/express';
import crypto from 'crypto';
import { Role } from '@prisma/client';
import RedisSingleton from './redisClient';
class UserQuery extends Repository {
  redis;

  constructor() {
    super();
    this.redis = RedisSingleton.getInstance();
  }
  hashPassword = async (input: string) => {
    return await bcryptjs.hash(input, 10);
  };

  CreateNewUser = async (userInfo: NewUser) => {
    const pass = await this.hashPassword(userInfo.password);
    const newUser = await this.user.create({
      data: {
        name: userInfo.name,
        email: userInfo.email,
        lastName: userInfo.lastName,
        password: pass,
        passwordChengeAt: new Date(),
        role: Role.USER,
        isActive: true,
        photo: userInfo.photo,
        orders: {
          create: [],
        },
      },
    });

    return newUser;
  };

  findUserByEmail = async (email: string) => {
    const user = await this.user.findUnique({
      where: {
        email: email,
        isActive: true,
      },
    });

    return user;
  };

  findUserById = async (id: any) => {
    const user = await this.user.findUnique({
      where: {
        id: id,
        isActive: true,
      },
    });
    return user;
  };

  getAllUser = async () => {
    const allUser = await this.user.findMany({
      omit: {
        password: true,
        passwordChengeAt: true,
      },
    });
    return allUser ? allUser : false;
  };
  updateUser = async (userEmail: string, data: {}) => {
    await this.user.update({
      where: {
        email: userEmail,
        isActive: true,
      },
      data,
    });
  };

  saveResetTokenOnRedis = async (userId: string, token: string) => {
    const tokenExprition = 600;

    try {
      await this.redis.setex(userId, tokenExprition, token);
      console.log('Token saved successfully');
    } catch (err) {
      console.error('Error saving token:', err);
    }
  };

  isTokenMatchWithRedis = async (token: string, id: string) => {
    const savedToken = await this.redis.get(id);
    if (!savedToken || savedToken != token) {
      return false;
    }
    return true;
  };

  createResetPasswordToken = async (email: string) => {
    const user = await this.findUserByEmail(email);
    const resetToken = crypto.randomBytes(32).toString('hex');

    if (user) {
      await this.saveResetTokenOnRedis(user.id, resetToken);
      return resetToken;
    }
  };
}

export default UserQuery;
