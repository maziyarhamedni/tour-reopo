"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield model.user.findMany({
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
