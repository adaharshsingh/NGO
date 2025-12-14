const IORedis = require("ioredis");

const redis = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.error("Redis error", err);
});

module.exports = redis;
