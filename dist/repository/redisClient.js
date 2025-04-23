"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts  
const ioredis_1 = __importDefault(require("ioredis"));
// Create a Redis client  
const redis = new ioredis_1.default({
    host: 'localhost', // Redis server address  
    port: 6379, // Redis server port  
    // password: 'your_redis_password', // Add password if required  
});
exports.default = redis;
