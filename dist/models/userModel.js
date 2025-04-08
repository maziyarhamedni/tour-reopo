import prisma from './model';
import bcrypt from 'bcrypt';
// import { NextFunction } from 'express';
class UserModel {
    constructor() {
        this.user = prisma.user;
    }
    async passwordChenged(jwtIat, passChenge) {
        const passChengeAt = parseInt(`${passChenge.getTime() / 1000}`, 10);
        return passChengeAt > jwtIat;
    }
    async correctPassword(password, hashedPassword) {
        if (hashedPassword) {
            return await bcrypt.compare(password, hashedPassword);
        }
    }
}
export default UserModel;
