// src/index.ts
import Redis from 'ioredis';

class RedisSingleton {
  private static instance:Redis;

  private constructor() {
  
  }

  public static getInstance(): Redis{
    if (!RedisSingleton.instance) {
      RedisSingleton.instance = new Redis({
        host: 'localhost',
        port: 6379,
      });
    }
    return RedisSingleton.instance;
  }
}

export default RedisSingleton;