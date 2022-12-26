const Redis = require("ioredis");

const redis = new Redis({
  port: 17572, // Redis port
  host: "redis-17572.c1.ap-southeast-1-1.ec2.cloud.redislabs.com", // Redis host
  password: process.env.PASSWORD_REDIS,
});

module.exports = redis;
