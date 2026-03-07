const OSS = require("ali-oss");
const config = require("../config/config-default");
const ossClient = new OSS({
  region: config.oss.region,
  accessKeyId: config.oss.accessKeyId,
  accessKeySecret: config.oss.accessKeySecret,
  bucket: config.oss.bucket,
});

module.exports = ossClient;
