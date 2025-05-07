"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts  
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default({
    host: 'localhost',
    port: 6379,
});
exports.default = redis;
