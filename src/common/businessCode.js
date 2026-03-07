/**
 * 业务状态码统一封装
 */
const BUSINESS_CODE = {
  SUCCESS: {
    code: 200,
    message: "成功",
  },
  PARAM_ERROR: {
    code: 400,
    message: "参数错误",
  },
  NOT_AUTH: {
    code: 401,
    message: "未登录",
  },
  ACCOUNT_EXCEPTION: {
    code: 403,
    message: "账号异常",
  },
  SYSTEM_ERROR: {
    code: 500,
    message: "系统错误",
  },
};

module.exports = {
  BUSINESS_CODE,
};
