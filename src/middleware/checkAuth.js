const whiteList = [
  "/api/user/login",
  "/api/user/register",
  "/api/user/detail",
  "/api/question/list",
  "/api/question/detail",
  "/api/questionBank/list",
];
const { getLoginUser } = require("@/service/user");
const ResponseUtils = require("@/common/responseUtils");
const { BUSINESS_CODE } = require("@/common/businessCode");
const checkAuth = (req, res, next) => {
  const url = req.originalUrl.split("?")[0];
  if (whiteList.includes(url)) {
    next();
  } else {
    const uerInfo = getLoginUser(req);
    if (!uerInfo) {
      res.json(ResponseUtils.error(BUSINESS_CODE.NOT_AUTH, "请先登录"));
    } else {
      next();
    }
  }
};

module.exports = checkAuth;
