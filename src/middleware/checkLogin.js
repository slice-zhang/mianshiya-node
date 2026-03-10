const { getLoginUser } = require("@/service/user");
const ResponseUtils = require("@/common/responseUtils");
const { BUSINESS_CODE } = require("@/common/businessCode");
const checkLogin = (req, res, next) => {
  const uerInfo = getLoginUser(req);
  if (!uerInfo) {
    res.json(ResponseUtils.error(BUSINESS_CODE.NOT_AUTH, "请先登录"));
  } else {
    next();
  }
};

module.exports = checkLogin;
