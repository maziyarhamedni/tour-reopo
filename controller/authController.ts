import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/AppError';
import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync';
import UserQuery from './../repository/userQuery';
import { NewUser } from './../utils/express';
// import sendEmail from './../utils/email';
import { Role } from '@prisma/client';
import sendEmail from './../utils/email';

interface Payload {
  id: string;
  iat: number;
}
class authController {
  userQurey: UserQuery;
  secret: string;
  cookieExpire: number;

  constructor() {
    this.secret = process.env.JWT_SECRET!;
    this.userQurey = new UserQuery();
    this.cookieExpire = parseInt(process.env.JWT_COOKIE_EXPIRSE_IN!);
  }

  jwtTokenCreator(id: any) {
    return jwt.sign({ id: id }, this.secret);
  }

  createSendToken(user: NewUser, statusCode: number, res: Response) {
    const token = this.jwtTokenCreator(user.id);
    const cookieOption = {
      expires: new Date(Date.now() + this.cookieExpire * 24 * 60 * 60 * 1000),
      secure: false,
      httpOnly: true,
    };

    if (process.env.NODE_ENV == 'production') {
      cookieOption.secure = true;
    }

    res.cookie('jwt', token, cookieOption);

    user.password = '';
    user.passwordConfrim = '';

    res.status(statusCode).json({
      status: 'seccessful',
      token: token,
      data: {
        user,
      },
    });
  }

  signUp = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = req.body;
      if (data.password == data.passwordConfrim) {
        console.log('pass and confrim pass correct');
        const newUser = await this.userQurey.CreateNewUser(data);
        this.createSendToken(newUser, 201, res);
      } else {
        return next(new AppError('passwords not match', 401));
      }
    }
  );

  //////////////////

  logIn = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(new AppError('password or email is wrong', 401));
      }
      const user = await this.userQurey.findUserByEmail(email);

      if (
        !user ||
        !(await this.userQurey.checkUserPassword(password, user.password))
      ) {
        return next(
          new AppError('password or email is wrong ... try again ', 401)
        );
      }

      this.createSendToken(user, 200, res);
    }
  );

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

  protect = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      let token: string;
      if (typeof req.headers.authorization == 'string') {
        const authorizaton = req.headers.authorization;

        if (authorizaton && authorizaton.startsWith('Bearer')) {
          token = authorizaton.split(' ')[1];
          const decode: Payload = await this.jwtVerifyPromisified(
            token,
            this.secret
          );

          const user = await this.userQurey.findUserById(decode.id);
          if (!decode.id || !user) {
            return next(new AppError('user in not exists anymore ', 404));
          }
          const passwordChengeRecently =
            await this.userQurey.isPassChengeRecently(
              decode.iat,
              user.passwordChengeAt!
            );

          if (passwordChengeRecently) {
            return next(
              new AppError(
                'user change password recently please login again ... ',
                401
              )
            );
          }

          req.user = user;
        }
      }

      next();
    }
  );

  // isAdmin
  forgotPassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const email = req.body.email;
      const user = await this.userQurey.findUserByEmail(email);

      if (!user)
        return next(
          new AppError('user not exists please inter valid email', 401)
        );

      //at first find user by email and create token in datavbase
      const resetToken = await this.userQurey.createResetPasswordToken(email);

      const resetURL = `${req.protocol}://${req.get(
        'host'
      )}/api/v1/users/resetPassword/${resetToken}`;

      const message = `Forgot your password? 
      Submit a PATCH request with your new password
       and passwordConfirm to: ${resetURL}.\n
       If you didn't forget your password, please ignore this email!`;

      // send resetToken to email

      try {
        await sendEmail({
          email: user.email,
          subject: 'Your password reset token (valid for 10 min)',
          message: message,
        });

        res.status(200).json({
          status: 'seccess',
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
  );

  resetPassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const resetToken = req.params.token;
      const user = await this.userQurey.findUserByRestToken(resetToken);

      if (!user) {
        next(new AppError('your token is expired or token is uncorrect', 401));
      } else {
        const pass = await this.userQurey.hashPassword(req.body.password);
        console.log(pass);
        await this.userQurey.updateUser(user.email, {
          resetPassword: '',
          expiredTime: '',
          password: pass,
          passwordChengeAt: new Date(),
        });
        this.createSendToken(user, 200, res);
      }
    }
  );

  updatePassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      console.log(req.user);
      const user = await this.userQurey.findUserById(req.user.id)!;
      const interdPassword = req.body.password;
      const newPassword = req.body.newPassword;
      const result = await this.userQurey.checkUserPassword(
        interdPassword,
        user?.password
      );
      // console.log(user, interdPassword, result);

      if (user && result) {
        const pass = await this.userQurey.hashPassword(newPassword);
        await this.userQurey.updateUser(user?.email, {
          password: pass,
          passwordChengeAt: new Date(),
        });

        this.createSendToken(user, 201, res);
      } else {
        return next(new AppError('password is not correct', 401));
      }
    }
  );

  authorizeAdmin = (...roles: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const user = await this.userQurey.findUserById(req.user.id)!;

      if (!user || !roles.includes(req.user.role)) {
        next(new AppError('you cannot access to this mission', 403));
      }
      next();
    };
  };

  deleteUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const deletedUser = await this.userQurey.findUserById(req.params.id);
      if (deletedUser) {
        console.log(deletedUser.email);
        await this.userQurey.updateUser(deletedUser.email, {
          isActive: false,
        });
        this.createSendToken(deletedUser, 204, res);
      }
      next(new AppError('user not found inter vlalid id ', 404));
    }
  );
}

export = authController;
