const { Sequelize } = require("sequelize");
const serverConfig = require("@/config");
const { isDevelopment } = require("@/utils");
const mysql2 = require("mysql2");
const mysqlBaseConfig = {
  pool: {
    max: 10,
    min: 2,
    idle: 30000,
    acquire: 60000,
    evict: 10000,
  },
  retry: {
    max: 5,
    backoffBase: 1000,
    backoffExponent: 1.5,
  },
};

const initMysql = async () => {
  const { name, username, password, host, dialect, config } =
    serverConfig.database || {};
  // 必备的配置
  const requiredFields = { name, username, password, host, dialect };
  const missingFields = Object.entries(requiredFields)
    .filter(([_, val]) => !val)
    .map(([key]) => key);

  if (missingFields.length > 0) {
    throw new Error(`MySQL 关键配置缺失：${missingFields.join(",")}`);
  }

  const sequelize = new Sequelize(name, username, password, {
    host,
    dialect,
    dialectModule: mysql2,
    pool: {
      ...mysqlBaseConfig.pool,
      ...(config?.pool || {}),
    },
    retry: {
      ...mysqlBaseConfig.retry,
      ...(config?.retry || {}),
    },
    logging: isDevelopment ? console.log : false,
  });

  await sequelize.authenticate();
  return sequelize;
};

module.exports = initMysql;
