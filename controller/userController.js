"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("./../models/userModel"));
const model = new userModel_1.default();
class UserController {
    constructor() {
        this.deleteUser = (req, res) => {
            const id = req.params.id;
            res.status(204).send(`user with id ${id}deleted `);
        };
    }
    async getAllUsers(req, res) {
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
    getUser(req, res) {
        const id = req.params.id;
        res.status(200).send(id);
    }
    updateUser(req, res) {
        const id = req.params.id;
        console.log(id);
        res.json(req.body);
    }
}
exports.default = UserController;
