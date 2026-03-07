const { pickBy } = require("lodash-es");
const isDevelopment = process.env.NODE_ENV === "development";

const getClientIp = (req) => {
  let clientIp = "";
  if (req.headers["x-forwarded-for"]) {
    clientIp = req.headers["x-forwarded-for"].split(",")[0].trim();
  }
  if (!clientIp && req.headers["x-real-ip"]) {
    clientIp = req.headers["x-real-ip"].trim();
  }
  if (!clientIp && req.ip) {
    clientIp = req.ip.trim();
  }
  if (!clientIp && req.connection?.remoteAddress) {
    clientIp = req.connection.remoteAddress;
  }
  if (!clientIp && req.socket?.remoteAddress) {
    clientIp = req.socket.remoteAddress;
  }
  if (clientIp.includes("::ffff:")) {
    clientIp = clientIp.replace("::ffff:", "");
  }
  return clientIp || "";
};

const cleanedObj = (value) => {
  if (typeof value === "object" && value) {
    return pickBy(value, (value) => value !== undefined && value !== null);
  }
  return value;
};

module.exports = {
  isDevelopment,
  getClientIp,
  cleanedObj,
};
