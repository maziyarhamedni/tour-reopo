import UserQuery from '../repository/userQuery';
import jwt from 'jsonwebtoken';
import { NewUser } from '../utils/express';
import sendEmail from './../utils/email';
import { EmailOption } from '../utils/express';
import bcryptjs from 'bcryptjs';
import redis from '../repository/redisClient';
import OrderQuery from '../repository/orderQuery';
 

class authService {
  userQuery;
  redis
  

  constructor() {
    this.userQuery = new UserQuery();
    this.redis = redis
  }

  jwtTokenCreator(id: any, secret: string) {
    return jwt.sign({ id: id }, secret);
  }

  sendEmail = async (emailOption: EmailOption) => {
    await sendEmail(emailOption);
  };

  checkSignUp = async (data: NewUser) => {
    if (data.password == data.passwordConfrim) {
  
      const newUser = await this.userQuery.CreateNewUser(data);
      return newUser;
    } else {
      return false;
    }
  };

 

  checkLogIn = async (email: string, password: string) => {
    const user = await this.userQuery.findUserByEmail(email);
    if (!user || !(await this.checkUserPassword(password, user.password))) {
      return false;
    }
    return user;
  };

  jwtVerifyPromisified = async function jwtVerify(
    token: string,
    secret: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      });
    });
  };

  forgotPasswordService = async (email: string) => {
    const user = await this.userQuery.findUserByEmail(email);
    const resetToken = await this.userQuery.createResetPasswordToken(email);
    if (!user || !resetToken) {
      return false;
    } else {
      return { resetToken, user };
    }
  };
 
  updateMe = async(email:string,data:{name?:string,lastName?:string})=>{

   await this.userQuery.updateUser(email,data)

   return true;


    
  }
  findUserIdAndPassChangeRecently = async (id: string, iat: number) => {
    const user = await this.userQuery.findUserById(id);

    if (!user) return false;
    const passwordChengeRecently = await this.isPassChengeRecently(
      iat,
      user.passwordChengeAt!
    );
    if (passwordChengeRecently) return false;

    return user;
  };


  resetPasswordService = async (resetToken: string, password: string,id:string) => {
    const result = await this.userQuery.isTokenMatchWithRedis(resetToken,id)
    const user = await this.userQuery.findUserById(id);
    if (!user || !result) return false;
    const pass = await this.userQuery.hashPassword(password);
    await this.userQuery.updateUser(user.email, {
      password: pass,
    });

    return user;
  };
  passwordChenged = async (jwtIat: any, passChenge: Date): Promise<Boolean> => {
    const passChengeAt = parseInt(`${passChenge.getTime() / 1000}`, 10);
    return passChengeAt > jwtIat;
  };

  async correctPassword(password: string, hashedPassword: string | null) {
    if (hashedPassword) {
      return await bcryptjs.compare(password, hashedPassword);
    }
  }
  updatePasswordServiced = async (
    id: string,
    oldPassword: string,
    newPassword: string
  ) => {
    const user = await this.userQuery.findUserById(id)!;

    const result = await this.checkUserPassword(oldPassword, user?.password);

    if (!user || !result) return false;
    const pass = await this.userQuery.hashPassword(newPassword);
    await this.userQuery.updateUser(user?.email, {
      password: pass,
      passwordChengeAt: new Date(),
    });

    return user;
  };

  checkUserRole = async (id: string, roles: string[]) => {
    const user = await this.userQuery.findUserById(id);
    if (user && roles.includes(user.role)) {
      return user;
    } else {
      return false;
    }
  };

  isPassChengeRecently = async (tokenTime: any, passChengeDate: Date) => {
    const res = this.passwordChenged(tokenTime, passChengeDate);
    return res;
  };

  checkUserPassword = async (interedPass: any, userPass: any) => {
    const res = this.correctPassword(interedPass, userPass);
    return res;
  };

  accessOnlyOwnUserAndAdmin = async (id: string, user: NewUser) => {
    const getUser = await this.userQuery.findUserById(id);
    if (getUser) {
      if (user.role == 'ADMIN' || getUser.id == user.id) {
        const userWithOrder = {
          ...user,
          order: [],
        };
        return userWithOrder;
      }
      return false;
    }
  };

  getAllUser = async () => {
    const users = await this.userQuery.getAllUser();
    return users ? users : false;
  };
  deleteUserService = async (id: string) => {
    const deletedUser = await this.userQuery.findUserById(id);
    if (deletedUser) {
      await this.userQuery.updateUser(deletedUser.email, {
        isActive: false,
      });
      return deletedUser;
    }
    return false;
  };
}

export default authService;
