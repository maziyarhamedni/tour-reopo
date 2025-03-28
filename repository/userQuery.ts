import UserModel from './../models/userModel';
import bcrypt from 'bcrypt';
import { NewUser } from './../utils/express';
import crypto from 'crypto';
import { Role } from '@prisma/client';
class UserQuery {
  model: UserModel;

  constructor() {
    this.model = new UserModel();
  }
  hashPassword = async (input: string) => {
    return await bcrypt.hash(input, 10);
  };

  CreateNewUser = async (userInfo: NewUser) => {
    // console.log(userInfo,pass)
    const pass = await this.hashPassword(userInfo.password);

    const date = Date.now().toString();
    // console.log('kkkkkkkk>>>>>>>>>>>')
    const newUser = await this.model.user.create({
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
      },
    });

    return newUser;
  };

  findUserByEmail = async (email: string) => {
    const user = await this.model.user.findUnique({
      where: {
        email: email,
        isActive: true,
      },
    });

    return user;
  };

  findUserById = async (id: any) => {
    const user = await this.model.user.findUnique({
      where: {
        id: id,
        isActive: true,
      },
    });
    return user;
  };

  isPassChengeRecently = async (tokenTime: any, passChengeDate: Date) => {
    const res = this.model.passwordChenged(tokenTime, passChengeDate);
    return res;
  };

  updateUser = async (userEmail: string, data: {}) => {
    await this.model.user.update({
      where: {
        email: userEmail,
        isActive: true,
      },
      data,
    });
  };

  checkUserPassword = async (interedPass: any, userPass: any) => {
    const res = this.model.correctPassword(interedPass, userPass);
    return res;
  };

  findUserByRestToken = async (resetToken: string) => {
    const token = crypto.createHash('sha256').update(resetToken).digest('hex');

    if (!token) {
      return false;
    }

    const user = await this.model.user.findUnique({
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
