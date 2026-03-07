require("module-alias/register");
const config = require("@/config");
const Server = require("@/server");
const initRoutes = require("@/router");
const model = require("@/model");
const initMysql = require("@/plugin/mysql");
const { initLogger, writeLog } = require("@/plugin/logger");
const checkAuth = require("@/middleware/checkAuth");
const sessionMiddleware = require("@/middleware/session");
const ossClient = require("@/plugin/oss");
let serverInstance = new Server();
let mysqlInstance = null;

// 封装启动逻辑为异步函数，统一处理错误
async function startApplication() {
  try {
    serverInstance = new Server();
    // 1、初始化数据库
    mysqlInstance = await initMysql();
    // 初始化模型实例
    const models = {};
    const associateList = [];
    Object.entries(model).map(([key, val]) => {
      const modelInstance = mysqlInstance.define(key, val.schema, val.options);
      models[key] = modelInstance;
      if (val.associate) {
        associateList.push(val.associate);
      }
    });
    associateList.forEach((associate) => {
      associate(models);
    });
    // 挂载models到server内部的app对象中，方便在业务路由函数里通过app访问到模型实例进行curd
    serverInstance.registerApp("sequelize", mysqlInstance);
    serverInstance.registerApp("models", models);
    console.log(`🚀 MYSQL服务注册成功`);

    // 挂载ossClient
    serverInstance.registerApp("ossClient", ossClient);
    console.log(`🚀 OSS服务注册成功`);

    // 2、注册session中间件
    serverInstance.registerGlobalMiddleware(sessionMiddleware);
    console.log(`🚀 session服务注册成功`);

    // 3、注册鉴权中间件
    serverInstance.registerGlobalMiddleware(checkAuth);
    console.log(`🚀 鉴权中间件注册成功`);

    // 4、挂载日志实例到app
    const accessLogStream = initLogger();
    const logger = writeLog.bind(null, accessLogStream);
    serverInstance.registerApp("logger", logger);
    console.log(`🚀 日志服务注册成功`);

    // 5. 初始化路由
    initRoutes(serverInstance);
    console.log(`🚀 路由注册成功`);

    // 6. 启动 HTTP 服务
    serverInstance.listen(config.port, () => {
      console.log(`🚀 服务启动成功，监听端口：${config.port}`);
    });
  } catch (error) {
    // 捕获数据库初始化失败的错误，优雅退出
    console.error(`💥 应用启动失败：${error.message || error}`);
    process.exit(1); // 退出进程
  }
}

async function shutdownApplication(signal) {
  console.log(`\n🛑 收到终止信号：${signal}，开始关闭资源`);
  try {
    // 1. 关闭HTTP服务（停止接收新请求）
    if (serverInstance) {
      await new Promise((resolve, reject) => {
        serverInstance.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      serverInstance = null;
      console.log("✅ HTTP服务已关闭");
    }

    // 2. 关闭MySQL连接池（释放数据库资源）
    if (mysqlInstance) {
      await mysqlInstance.close(); // Sequelize实例的关闭方法
      mysqlInstance = null;
      console.log("✅ MySQL连接池已关闭");
    }

    console.log("✅ 所有资源已安全释放，进程退出");
    process.exit(0);
  } catch (error) {
    console.error(`💥 关闭资源失败：${error.message || error}`);
    process.exit(1);
  }
}

// 监听终止信号，使用异步回调
process.on("SIGINT", () => shutdownApplication("SIGINT")); // Ctrl + C
process.on("SIGTERM", () => shutdownApplication("SIGTERM")); // 容器/系统终止
process.on("SIGQUIT", () => shutdownApplication("SIGQUIT")); // Ctrl + \

// 启动应用
startApplication();
