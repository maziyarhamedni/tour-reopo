import UserModel from './../models/userModel';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Role } from '@prisma/client';
class UserQuery {
    constructor() {
        this.hashPassword = async (input) => {
            return await bcrypt.hash(input, 10);
        };
        this.CreateNewUser = async (userInfo) => {
            const pass = await this.hashPassword(userInfo.password);
            const date = Date.now().toString();
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
                    photo: userInfo.photo
                },
            });
            return newUser;
        };
        this.findUserByEmail = async (email) => {
            const user = await this.model.user.findUnique({
                where: {
                    email: email,
                    isActive: true,
                },
            });
            return user;
        };
        this.findUserById = async (id) => {
            const user = await this.model.user.findUnique({
                where: {
                    id: id,
                    isActive: true,
                },
            });
            return user;
        };
        this.isPassChengeRecently = async (tokenTime, passChengeDate) => {
            const res = this.model.passwordChenged(tokenTime, passChengeDate);
            return res;
        };
        this.updateUser = async (userEmail, data) => {
            await this.model.user.update({
                where: {
                    email: userEmail,
                    isActive: true,
                },
                data,
            });
        };
        this.checkUserPassword = async (interedPass, userPass) => {
            const res = this.model.correctPassword(interedPass, userPass);
            return res;
        };
        this.findUserByRestToken = async (resetToken) => {
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
        this.createResetPasswordToken = async (email) => {
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
        this.model = new UserModel();
    }
}
export default UserQuery;
