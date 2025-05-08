import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import authService from '../service/authService';
import multer from 'multer';
import { NewUser, UserSafeInfo } from '../utils/express';
import sharp from 'sharp';

class userController {
  secret: string;
  cookieExpire: number;
  service: authService;
  dayInMiliSecond: number;
  upload;
  multerStorage;
  uploadUserPhoto;

  constructor() {
    this.secret = process.env.JWT_SECRET!;
    this.cookieExpire = parseInt(process.env.JWT_COOKIE_EXPIRSE_IN!);
    this.multerStorage = multer.memoryStorage();
    this.dayInMiliSecond = parseInt(process.env.DAY_IN_MILISECOND!);
    this.service = new authService();
    this.upload = multer({
      storage: this.multerStorage,
      fileFilter: this.multerFilter,
    });
    this.uploadUserPhoto = this.upload.single('photo');
  }

  multerFilter = (req: Request, file: any, cb: Function) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError('not an image file , please upload image ', 400), false);
    }
  };

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

        res
          .status(204)
          .send(
            `user with namd ${isDeleteUser.name} and id ${isDeleteUser.id} is unactived ...`
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
  resizePhoto = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.file) {
        return next();
      }

      req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

      await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);

      next();
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

      const safeUser = this.setUserInfoSafe(user);

      res.status(200).json({
        status: 'successful',
        safeUser,
      });
    }
  );

  updateUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const photo = req.file?.filename;
      const user = await this.service.accessOnlyOwnUserAndAdmin(
        req.params.id,
        req.user
      );
      if (!user) {
        return next(
          new AppError('you cannot access to other user update ', 403)
        );
      }

      const { lastName, name } = req.body;

      this.service.updateMe(user.email, { name, lastName, photo });
      res.status(200).json({
        status: 'successful',
        lastName,
        name,
        photo
      });
    }
  );
}

export default userController;
