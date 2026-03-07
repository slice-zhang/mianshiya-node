const express = require("express");
const bodyParser = require("body-parser");
const ResponseUtils = require("@/common/responseUtils");
const { BUSINESS_CODE } = require("@/common/businessCode");
const config = require("@/config/index");
const { getClientIp, isDevelopment } = require("@/utils");
const cors = require("cors");
class Server {
  constructor() {
    this.server = express();
    this.httpServer = null;
    this.app = {};
    this.middleware = [];
    this._init();
  }

  _init() {
    // 配置跨域
    this.server.use(
      cors({
        origin: "http://localhost:3001", // 固定前端域名，适配 credentials: true
        credentials: true, // 允许携带 Cookie（前端需同步配置 withCredentials: true）
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // 补充 OPTIONS 方法
        optionsSuccessStatus: 200,
        preflightContinue: false,
        allowedHeaders: "*", // 宽松允许所有请求头
        maxAge: 3600,
      })
    );
    // 初始化body参数的解析（表单 / json）
    this.server.use(
      bodyParser.urlencoded({
        extended: true,
        parameterLimit: config.requestLimit,
      })
    );
    this.server.use(bodyParser.json({ parameterLimit: config.requestLimit }));
    // 禁用某些响应头的返回
    this.server.set("x-powered-by", false);
  }

  /**
   * 注册全局中间件
   * @param {*} callback
   * @param {*} method
   * @returns
   */
  registerGlobalMiddleware(callback) {
    if (!callback) {
      console.error("请传入注册项");
      return;
    }
    this.server.use(callback);
  }

  /**
   * 挂载外部实例
   * @param {*} key
   * @param {*} value
   */
  registerApp(key, value) {
    this.app[key] = value;
  }

  /**
   * 设置路由
   * @param {*} path
   * @param {*} handlerFunction
   * @param {*} method
   */
  setRoute(path, handlerFunction, method = "get", middleware = []) {
    const requestMethod = method.toLowerCase();
    const handler = async (req, res, next) => {
      const requestParams = requestMethod === "get" ? req.query : req.body;
      // 黑名单IP过滤
      const clientIP = getClientIp(req);
      if (
        clientIP &&
        (config.blackIpList.includes(clientIP) ||
          config.tempBlockIpList.includes(clientIP))
      ) {
        res.json(ResponseUtils.error(BUSINESS_CODE.ACCOUNT_EXCEPTION));
        return;
      }
      // 如果访问数据巨大，给一次访问的机会,第二次限制
      if (requestParams?.pageSize > 200) {
        tempBlockIpList.push(clientIP);
      }
      let result;
      try {
        const handleResult = await handlerFunction(this.app, req, res, next);
        result = ResponseUtils.success(handleResult || null);
        // 成功了记录日志
        if (!isDevelopment) {
          this.app.logger && this.app.logger(req);
        }
      } catch (error) {
        // 失败了记录日志
        if (isDevelopment) {
          console.error("error", error);
        } else {
          this.app.logger &&
            this.app.logger(req, error.message || error, "ERROR");
        }
        result = ResponseUtils.error(
          BUSINESS_CODE.SYSTEM_ERROR,
          error?.message || error
        );
      }
      res.json(result);
    };

    const warpMiddlewareError = (callback) => {
      return async (req, res, next) => {
        try {
          await callback(req, res, next);
        } catch (error) {
          if (isDevelopment) {
            console.error("error", error);
          } else {
            this.app.logger &&
              this.app.logger(req, error.message || error, "ERROR");
          }
          res.json(
            ResponseUtils.error(
              BUSINESS_CODE.SYSTEM_ERROR,
              error?.message || error
            )
          );
        }
      };
    };

    const middlewareHandler = middleware.map((item) =>
      warpMiddlewareError(item)
    );

    const completePath = `${config.requestPrefix}${path}`;
    this.server[requestMethod](completePath, [...middlewareHandler, handler]);
  }

  /**
   * 启动服务
   * @param {*} port
   * @param {*} args
   */
  listen(port, ...args) {
    this.httpServer = this.server.listen(port, ...args);
  }

  close(callback) {
    if (!callback || typeof callback !== "function") {
      console.error("callback is not a function");
    }
    this.httpServer.close(callback);
  }
}

module.exports = Server;
