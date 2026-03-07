const fs = require("fs");
const path = require("path");
const FileStreamRotator = require("file-stream-rotator");
const { getClientIp, isDevelopment } = require("@/utils");

function initLogger() {
  const logDir = path.join(__dirname, "../logs");
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  return FileStreamRotator.getStream({
    filename: path.join(logDir, "access-%DATE%.log"),
    frequency: "daily",
    date_format: "YYYY-MM-DD",
    verbose: false,
    max_size: "20m",
    max_files: "30d",
  });
}

function formatLog(config) {
  const {
    clientIp,
    requestTime,
    url,
    method,
    body,
    userAgent,
    content,
    level,
  } = config;
  return `[请求时间]: ${requestTime} | [日志级别]: ${level} | [客户端IP]: ${clientIp} | [请求URL]: ${url} | [请求方法]: ${method} | [浏览器]: ${userAgent}  | [Body参数]: ${
    JSON.stringify(body) || "-"
  } | [自定义内容]: ${content || "-"}\n`;
}

function writeLog(accessLogStream, req, content = "", level = "INFO") {
  const clientIp = getClientIp(req) || "-";
  const requestTime = new Date().toLocaleString().replaceAll(/\//g, "-");
  const url = req.originalUrl || "-";
  const method = req.method || "-";
  const body = req.body;
  const userAgent = req.headers["user-agent"] || "-";
  const text = formatLog({
    clientIp,
    requestTime,
    url,
    method,
    body,
    userAgent,
    content,
    level,
  });
  if (isDevelopment) {
    console.log(text);
  } else {
    accessLogStream.write(text);
  }
}

module.exports = {
  initLogger,
  writeLog,
};
