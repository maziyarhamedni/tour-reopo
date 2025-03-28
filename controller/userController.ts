import { Request, Response } from 'express';
import UserModel from './../models/userModel';

const model = new UserModel();
class UserController {
  async getAllUsers(req: Request, res: Response) {
    const users = await model.user.findMany({
      where: {
        isActive: true,
      },
      omit: {
        password: true,
        passwordConfrim: true,
        passwordChengeAt: true,
        role: true,
        resetPassword: true,
        expiredTime: true,
        isActive: true,
      },
    });
    res.status(200).json({
      status: 'seccessful',
      count: users.length,
      data: users,
    });
  }

  getUser(req: Request, res: Response) {
    const id = req.params.id;
    res.status(200).send(id);
  }

  updateUser(req: Request, res: Response) {
    const id = req.params.id;
    console.log(id);
    res.json(req.body);
  }

  deleteUser = (req: Request, res: Response) => {
    const id = req.params.id;
    res.status(204).send(`user with id ${id}deleted `);
  };
}

export default UserController;
