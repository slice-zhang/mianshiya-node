const { USER_ROLE } = require("@/constant");
const { getLoginUser } = require("@/service/user");
const isAdmin = (req, res, next) => {
  const userInfo = getLoginUser(req);
  if (userInfo.user_role !== USER_ROLE.ADMIN) {
    throw new Error("用户无操作权限");
  }
  next();
};

module.exports = isAdmin;
