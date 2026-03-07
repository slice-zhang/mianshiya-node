const env = process.env.NODE_ENV || "development";

const baseConfig = require("./config-default.js");

const envConfig = require(`./config-${env}.js`);

const finalConfig = { ...baseConfig, ...envConfig };

module.exports = finalConfig;
