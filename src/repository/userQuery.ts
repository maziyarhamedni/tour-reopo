import Repository from './repository';
import bcryptjs from 'bcryptjs';
import { NewUser } from './../utils/express';
import crypto from 'crypto';
import { Role } from '@prisma/client';
import redis from './redisClient';
class UserQuery {
  repository;
  redis;

  constructor() {
    const repository = new Repository();
    this.redis = redis;
    this.repository = repository.prisma;
  }
  hashPassword = async (input: string) => {
    return await bcryptjs.hash(input, 10);
  };

  CreateNewUser = async (userInfo: NewUser) => {
    const pass = await this.hashPassword(userInfo.password);
    const date = Date.now().toString();
    const newUser = await this.repository.user.create({
      data: {
        name: userInfo.name,
        email: userInfo.email,
        lastName: userInfo.lastName,
        password: pass,
        passwordConfrim: 'ok',
        passwordChengeAt: new Date(),
        resetPassword: date + 'e',
        role: Role.USER,
        expiredTime: '',
        isActive: true,
        photo: userInfo.photo,
      },
    });

    return newUser;
  };

  findUserByEmail = async (email: string) => {
    const user = await this.repository.user.findUnique({
      where: {
        email: email,
        isActive: true,
      },
    });

    return user;
  };

  findUserById = async (id: any) => {
    const user = await this.repository.user.findUnique({
      where: {
        id: id,
        isActive: true,
      },
    });
    return user;
  };

  getAllUser = async () => {
    const allUser = await this.repository.user.findMany({
      where:{
        isActive:true
      }
    })

    console.log(allUser)
    return (allUser) ? allUser : false;
  };
  updateUser = async (userEmail: string, data: {}) => {
    await this.repository.user.update({
      where: {
        email: userEmail,
        isActive: true,
      },
      data,
    });
  };

  findUserByRestToken = async (resetToken: string) => {

    const token = crypto.createHash('sha256').update(resetToken).digest('hex');

    if (!token) {
      return false;
    }

    const user = await this.repository.user.findUnique({
      where: {
        resetPassword: token,
        isActive: true,
      },
    });

    if (user && parseInt(user.expiredTime) > Date.now()) {
      return user;
    }
    return false;
  };

  createResetPasswordToken = async (email: string) => {
    const user = await this.findUserByEmail(email);
    const date = (Date.now() + 10 * 60 * 1000).toString();
    const resetToken = crypto.randomBytes(32).toString('hex');
    // this.redis.
    if (user) {
      user.resetPassword = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      await this.updateUser(email, {
        resetPassword: user.resetPassword,
        expiredTime: date,
      });
      return resetToken;
    }
  };
}

export default UserQuery;
