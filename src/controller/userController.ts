import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import authService from '../service/authService';
import { NewUser, UserSafeInfo } from '../utils/express';

class userController {
  secret: string;
  cookieExpire: number;
  service:authService;
  dayInMiliSecond:number;

  constructor() {
    this.secret = process.env.JWT_SECRET!;
    this.cookieExpire = parseInt(process.env.JWT_COOKIE_EXPIRSE_IN!);
    this.dayInMiliSecond = parseInt(process.env.DAY_IN_MILISECOND!);
    this.service = new authService();
  }

  snedResponse = (statusCode: number, data: NewUser, res: Response) => {
    const user = this.setUserInfoSafe(data);
    res.status(statusCode).json(user);
  };

  setUserInfoSafe = (user: NewUser): UserSafeInfo => {
    const { email, id, lastName, photo, name, role } = user;
    const sendedUser = { email, id, lastName, photo, name, role };
    return sendedUser;
  };

  createJwtToken(user: NewUser, statusCode: number, res: Response) {
    const sendedUser = this.setUserInfoSafe(user);
    const token = this.service.jwtTokenCreator(user.id, this.secret);
    const cookieOption = {
      expires: new Date(Date.now() + this.cookieExpire * this.dayInMiliSecond),
      secure: false,
      httpOnly: true,
    };

    if (process.env.NODE_ENV == 'production') {
      cookieOption.secure = true;
    }
    res.cookie('jwt', token, cookieOption);

    res.status(statusCode).json({
      status: 'seccessful',
      token: token,
      data: {
        sendedUser,
      },
    });
  }

  deleteUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await this.service.accessOnlyOwnUserAndAdmin(
        req.params.id,
        req.user
      );
      if (user) {
        const id = req.params.id;
        const isDeleteUser = await this.service.deleteUserService(id);

        if (!isDeleteUser) {
          return next(new AppError('cant delete user', 404));
        }
        const userWithOrder = {
          ...isDeleteUser,
          order: [],
         
        };
        res
          .status(200)
          .send(
            `user with namd ${userWithOrder.name} and id ${userWithOrder.id} is unactived ...`
          );
      }
    }
  );

  getAllUsers = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const users = await this.service.getAllUser();
      if (users) {
        res.status(200).json({
          message: 'seccuseful',
          data: users,
        });
      }
    }
  );

  getUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await this.service.accessOnlyOwnUserAndAdmin(
        req.params.id,
        req.user
      );
      if (!user) {
        return next(new AppError('you cant get other user info', 403));
      }
      const userWithOrder = {
        ...user,
        order: [],
       
      };
      this.snedResponse(200, userWithOrder, res);
    }
  );

  updateUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await this.service.accessOnlyOwnUserAndAdmin(
        req.params.id,
        req.user
      );
      if (!user) {
        return next(
          new AppError('you cannot access to other user update ', 403)
        );
      }
      console.log(req.file);

      res.json(req.body);
    }
  );
}

export default userController;
