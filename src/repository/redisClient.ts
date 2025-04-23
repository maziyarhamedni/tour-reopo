// src/index.ts  
import Redis from 'ioredis';  

// Create a Redis client  
const redis = new Redis({  
  host: 'localhost', // Redis server address  
  port: 6379,        // Redis server port  
  // password: 'your_redis_password', // Add password if required  
});  



export default redis;