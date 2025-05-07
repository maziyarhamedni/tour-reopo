"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../utils/AppError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const authService_1 = __importDefault(require("../service/authService"));
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
class userController {
    constructor() {
        this.multerFilter = (req, file, cb) => {
            if (file.mimetype.startsWith('image')) {
                cb(null, true);
            }
            else {
                cb(new AppError_1.default('not an image file , please upload image ', 400), false);
            }
        };
        this.setUserInfoSafe = (user) => {
            const { email, id, lastName, photo, name, role } = user;
            const sendedUser = { email, id, lastName, photo, name, role };
            return sendedUser;
        };
        this.deleteUser = (0, catchAsync_1.default)(async (req, res, next) => {
            const user = await this.service.accessOnlyOwnUserAndAdmin(req.params.id, req.user);
            if (user) {
                const id = req.params.id;
                const isDeleteUser = await this.service.deleteUserService(id);
                if (!isDeleteUser) {
                    return next(new AppError_1.default('cant delete user', 404));
                }
                res
                    .status(204)
                    .send(`user with namd ${isDeleteUser.name} and id ${isDeleteUser.id} is unactived ...`);
            }
        });
        this.getAllUsers = (0, catchAsync_1.default)(async (req, res, next) => {
            const users = await this.service.getAllUser();
            if (users) {
                res.status(200).json({
                    message: 'seccuseful',
                    data: users,
                });
            }
        });
        this.resizePhoto = (0, catchAsync_1.default)(async (req, res, next) => {
            if (!req.file) {
                return next();
            }
            req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
            await (0, sharp_1.default)(req.file.buffer)
                .resize(500, 500)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/img/${req.file.filename}`);
            next();
        });
        this.getUser = (0, catchAsync_1.default)(async (req, res, next) => {
            const user = await this.service.accessOnlyOwnUserAndAdmin(req.params.id, req.user);
            if (!user) {
                return next(new AppError_1.default('you cant get other user info', 403));
            }
            const safeUser = this.setUserInfoSafe(user);
            res.status(200).json({
                status: 'successful',
                safeUser,
            });
        });
        this.updateUser = (0, catchAsync_1.default)(async (req, res, next) => {
            const user = await this.service.accessOnlyOwnUserAndAdmin(req.params.id, req.user);
            if (!user) {
                return next(new AppError_1.default('you cannot access to other user update ', 403));
            }
            const { lastName, name } = req.body;
            this.service.updateMe(user.email, { name, lastName });
            res.status(200).json({
                status: 'successful',
                lastName,
                name,
            });
        });
        this.secret = process.env.JWT_SECRET;
        this.cookieExpire = parseInt(process.env.JWT_COOKIE_EXPIRSE_IN);
        this.multerStorage = multer_1.default.memoryStorage();
        this.dayInMiliSecond = parseInt(process.env.DAY_IN_MILISECOND);
        this.service = new authService_1.default();
        this.upload = (0, multer_1.default)({
            storage: this.multerStorage,
            fileFilter: this.multerFilter,
        });
        this.uploadUserPhoto = this.upload.single('photo');
    }
}
exports.default = userController;
