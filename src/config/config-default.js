module.exports = {
  // 请求参数最大限制
  requestLimit: 5120,
  // 请求前缀
  requestPrefix: "/api",
  // 永久封禁ip
  blackIpList: [],
  // 临时封禁
  tempBlockIpList: [],
  port: 3002,
  redis: {
    host: "",
    port: 6379,
    password: "",
    db: 1,
  },
  session: {
    prefix: "mianshiya:user:", // session存储的前缀
    ttl: 3600, // 过期时间
    secret: "", // sessionID加密的密钥
    rolling: true, // 每次请求都更新session的过期时间
    resave: false, // 不强制重新保存未修改的会话
    saveUninitialized: false, // 不保存未初始化的会话（减少无效数据）
  },
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 3600,
  },
  oss: {
    path: "mianshiya",
    region: "",
    accessKeyId: "",
    accessKeySecret: "",
    bucket: "",
  },
  database: {
    host: "",
    username: "",
    password: "",
    name: "mianshiya",
    dialect: "mysql",
    // 以下是对应sequelize的数据库配置
    config: {
      pool: {
        max: 10, // 最大连接数（根据业务调整）
        min: 2, // 最小空闲连接数（>0 则始终保留连接，避免频繁重建）
        idle: 30000, // 空闲连接超时时间（30秒，超时后关闭空闲连接）
        acquire: 60000, // 获取连接的超时时间（60秒）
        evict: 10000, // 检查空闲连接的间隔（10秒）
      },
      // 可选：自动重连配置（增强稳定性）
      retry: {
        max: 5, // 最大重连次数
        backoffBase: 1000, // 重连间隔基数（1秒）
        backoffExponent: 1.5, // 间隔指数增长（1s → 1.5s → 2.25s...）
      },
    },
  },
};
