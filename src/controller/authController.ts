import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import {
  EmailOption,
  NewUser,
  Payload,
  UserSafeInfo,
} from './../utils/express';
import authService from '../service/authService';

class authController {
  secret: string;
  cookieExpire: number;
  service;
  dayInMiliSecond;

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

  signUp = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = req.body;
      const result = await this.service.checkSignUp(data);
      if (!result) {
        return next(new AppError('you are not sign up try again', 403));
      }
      this.createJwtToken(result, 201, res);
    }
  );

  logIn = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(new AppError('please enter password and email ', 401));
      }
      const user = await this.service.checkLogIn(email, password);
      if (!user) {
        return next(new AppError('email or password is not correct', 403));
      }
      this.createJwtToken(user, 200, res);
    }
  );

  protect = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      let token: string;
      if (typeof req.headers.authorization == 'string') {
        const authorizaton = req.headers.authorization;

        if (authorizaton && authorizaton.startsWith('Bearer')) {
          token = authorizaton.split(' ')[1];
        } else {
          token = req.cookies.jwt;
        }
        const decode: Payload = await this.service.jwtVerifyPromisified(
          token,
          this.secret
        );
        const user = await this.service.findUserIdAndPassChangeRecently(
          decode.id,
          decode.iat
        );
        if (!decode.id || !user) {
          return next(new AppError('user in not exists anymore ', 404));
        }
        req.user = user;
      }

      next();
    }
  );

  isLoggedIn = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      if (req.cookies.jwt) {
        try {
          const decode: Payload = await this.service.jwtVerifyPromisified(
            req.cookies.jwt,
            this.secret
          );
          const user = await this.service.findUserIdAndPassChangeRecently(
            decode.id,
            decode.iat
          );
          if (!user) {
            return next();
          }
          res.locals.user = user;
          return next();
        } catch (err) {
          console.error('Error verifying JWT or finding user:', err);
          return next();
        }
      }

      next();
    }
  );

  forgotPassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const email = req.body.email;
      const data = await this.service.forgotPasswordService(email);
      if (data) {
        const { user, resetToken } = data;
        const resetURL = `${req.protocol}://${req.get(
          'host'
        )}/api/v1/users/resetPassword/${resetToken}`;
        const message = `Forgot your password? 
        Submit a PATCH request with your new password
         and passwordConfirm to: ${resetURL}.\n
         If you didn't forget your password, please ignore this email!`;
        const emailOption: EmailOption = {
          email: user.email,
          subject: 'Your password reset token (valid for 10 min)',
          message: message,
        };
        try {
          await this.service.sendResetTokenToEmail(emailOption);
          res.status(200).json({
            status: 'seccessful',
            meassge: 'check your email box ',
          });
        } catch (err) {
          next(
            new AppError(
              'There was an error sending the email. Try again later!',
              500
            )
          );
        }
      }
    }
  );

  resetPassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const resetToken = req.params.token;
      const result = await this.service.resetPasswordService(
        resetToken,
        req.body.password
      );
      if (!result) {
        next(new AppError('your token is expired or token is uncorrect', 401));
      } else {
        this.createJwtToken(result, 200, res);
      }
    }
  );

  updatePassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req.user.id!;
      const oldPassword = req.body.password;
      const newPassword = req.body.newPassword;
      const result = await this.service.updatePasswordServiced(
        id,
        oldPassword,
        newPassword
      );
      if (!result) {
        return next(new AppError('user not found ', 404));
      }
      this.createJwtToken(result, 200, res);
    }
  );

  authorizeAdmin = (...roles: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const user = await this.service.checkUserRole(req.user.id, roles);
      if (!user) {
        next(new AppError('you cannot access to this mission', 403));
      }
      next();
    };
  };

  deleteUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id;
      const isDeleteUser = await this.service.deleteUserService(id);

      if (!isDeleteUser) {
        return next(new AppError('cant delete user', 404));
      }

      this.createJwtToken(isDeleteUser, 204, res);
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
      const user = await this.service.getUser(req.params.id, req.user);
      if (!user) {
        return next(new AppError('cant get users', 404));
      }
      this.snedResponse(200, user, res);
    }
  );

  updateUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    console.log(id);
    res.json(req.body);
  });
}

export default authController;
