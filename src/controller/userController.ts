import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import authService from '../service/authService';
import { NewUser, UserSafeInfo } from '../utils/express';

class userController {
  secret: string;
  cookieExpire: number;
  service: authService;
  dayInMiliSecond: number;

  constructor() {
    this.secret = process.env.JWT_SECRET!;
    this.cookieExpire = parseInt(process.env.JWT_COOKIE_EXPIRSE_IN!);
    this.dayInMiliSecond = parseInt(process.env.DAY_IN_MILISECOND!);
    this.service = new authService();
  }

 
  setUserInfoSafe = (user: NewUser): UserSafeInfo => {
    const { email, id, lastName, photo, name, role } = user;
    const sendedUser = { email, id, lastName, photo, name, role };
    return sendedUser;
  };

  

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
          .status(204)
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
      const safeUser = this.setUserInfoSafe(userWithOrder)
    
      res.status(200).json({
        status: 'successful',
        safeUser,
      });
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
