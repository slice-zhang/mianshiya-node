const { createClient } = require("redis");
const serverConfig = require("@/config");

const redisClient = createClient({
  url: `redis://${serverConfig.redis.host}:${serverConfig.redis.port}`,
  password: serverConfig.redis.password,
  database: serverConfig.redis.db,
  socket: {
    connectTimeout: 10000,
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        return new Error("redis断开达到最大重试次数");
      }
      return Math.min(retries * 1000, 5000);
    },
  },
});

redisClient.on("error", (err) => {
  console.error("Redis 客户端错误：", err.message);
});

redisClient.on("connect", () => {
  console.log("Redis 开始连接...");
});

redisClient.on("ready", () => {
  console.log("Redis 连接成功！");
});

redisClient.on("end", () => {
  console.log("Redis 连接已关闭");
});

(async () => {
  try {
    await redisClient.connect(); // 关键：显式调用 connect()
  } catch (err) {
    console.error("Redis 连接失败：", err.message);
  }
})();

module.exports = redisClient;
