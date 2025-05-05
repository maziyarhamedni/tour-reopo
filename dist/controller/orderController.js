"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const open_1 = __importStar(require("open"));
const axios_1 = __importDefault(require("axios"));
const orderService_1 = __importDefault(require("../service/orderService"));
class orderController {
    constructor() {
        this.redirectUserToPayment = (0, catchAsync_1.default)(async (req, res, next) => {
            const { price, count } = req.body;
            const tourId = req.params.tourId;
            const userId = req.user.id;
            this.count = count;
            this.price = parseInt(String(price * count));
            await this.sendPaymentRequest(tourId, userId);
            res.send('payment page is loding...');
        });
        this.getOrderByUserId = (0, catchAsync_1.default)(async (req, res, next) => {
            const userId = req.params.userId;
            const orders = await this.service.getOrderbyUserId(userId);
            if (orders) {
                res.status(200).json(orders);
            }
            else {
                console.log('this is not order yet [] ');
            }
        });
        this.sendPaymentRequest = async (tourId, userId) => {
            try {
                const response = await axios_1.default.post('https://sandbox.zarinpal.com/pg/v4/payment/request.json', {
                    merchant_id: this.shenaseSite,
                    amount: this.price,
                    callback_url: `http://127.0.0.1:3000/payment/${tourId}/${userId}/${this.price}`,
                    description: ` buy tour from site tour.com `,
                    metadata: {
                        userId: `${userId}`,
                        tourId: `${tourId}`,
                    },
                }, {
                    headers: {
                        accept: 'application/json',
                        'content-type': 'application/json',
                    },
                });
                const authority = response.data.data
                    .authority;
                await (0, open_1.default)(`https://sandbox.zarinpal.com/pg/StartPay/${authority}`, {
                    app: {
                        name: open_1.apps.chrome,
                    },
                });
            }
            catch (error) {
                const axiosError = error;
                console.error('Error:', axiosError.response ? axiosError.response.data : axiosError.message);
            }
        };
        this.shenaseSite = process.env.SITE_PAYMENT_ID;
        this.price = 0;
        this.count = 0;
        this.service = new orderService_1.default();
    }
}
exports.default = orderController;
