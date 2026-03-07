const { USER_SESSION_KEY, USER_ROLE } = require("@/constant");
const { hashPassword, verifyPassword } = require("@/utils/bcrypt");
const shortid = require("shortid");
const userUpdateDto = require("@/dto/userUpdateDto");
const userQueryByPageDto = require("@/dto/userQueryByPageDto");
const userRegisterDto = require("@/dto/userRegisterDto");
const { Op } = require("sequelize");

/**
 * 获取登录用户（内部使用）
 * @param {*} app
 * @param {*} req
 * @returns
 */
const getLoginUser = (req) => {
  const userInfo = req.session?.[USER_SESSION_KEY];
  return userInfo || null;
};

/**
 * 获取登录用户信息（接口使用）
 * @param {*} app
 * @param {*} req
 * @returns
 */
const getLoginUserDetail = (app, req) => {
  const userInfo = req.session?.[USER_SESSION_KEY];
  console.log("userInfo", userInfo);
  if (!userInfo) {
    throw new Error("用户未登录");
  }
  return getSafelyUser(userInfo);
};

/**
 * 根据id获取用户详情
 * @param {*} app
 * @param {*} id
 * @returns
 */
const getUserDtailById = async (app, req) => {
  if (!req.query.id) {
    throw new Error("id必填");
  }
  const user = await app.models.User.findByPk(req.query.id);
  if (!user) {
    throw new Error("用户不存在");
  }
  return getSafelyUser(user);
};

/**
 * 用户登出
 * @param {*} app
 * @param {*} req
 * @returns
 */
const userLogout = (app, req) => {
  req.session.destroy();
  return null;
};

/**
 * 用户注册
 * @param {*} app
 * @param {*} req
 * @returns
 */
const userRegister = async (app, req) => {
  const params = await userRegisterDto.validateAsync(req.body);
  const { username, password, invite_user } = params;
  const user = await app.models.User.findOne({ where: { username } });

  if (user !== null) {
    throw new Error("用户已存在");
  }
  const shareCode = shortid.generate();
  const newPassword = await hashPassword(password);
  await app.models.User.create({
    username,
    password: newPassword,
    share_code: shareCode,
    invite_user,
  });
  return null;
};

/**
 * 用户登录
 * @param {*} app
 * @param {*} req
 * @returns
 */
const userLogin = async (app, req) => {
  const { username, password } = req.body;

  // 防止重复登录
  const userInfo = getLoginUser(req);

  if (userInfo && userInfo.username === username) {
    throw new Error("用户已登录");
  }

  if (!username || !password) {
    throw new Error("用户名或密码不能为空");
  }

  const user = await app.models.User.findOne({ where: { username } });

  if (user === null) {
    throw new Error("用户不存在");
  }

  if (user.user_role === USER_ROLE.BAN) {
    throw new Error("用户被封禁");
  }

  const isMatch = await verifyPassword(password, user.password);

  if (!isMatch) {
    throw new Error("密码错误");
  }
  req.session[USER_SESSION_KEY] = user;
  return getSafelyUser(user);
};

/**
 * 删除用户
 * @param {*} app
 * @param {*} req
 * @returns
 */
const userDelete = async (app, req) => {
  const userInfo = getLoginUser(req);

  if (userInfo.user_role !== USER_ROLE.ADMIN) {
    throw new Error("用户无权限操作");
  }

  const userId = req.query.id;
  const user = await app.models.User.findByPk(userId);
  if (user === null) {
    throw new Error("用户不存在");
  }
  await app.models.User.destroy({ where: { id: userId } });
  return null;
};

/**
 * 更新用户
 * @param {*} app
 * @param {*} req
 * @returns
 */
const userUpdate = async (app, req) => {
  const params = await userUpdateDto.validateAsync(req.body);
  const userInfo = getLoginUser(req);

  if (userInfo.user_role !== USER_ROLE.ADMIN && params.id !== userInfo.id) {
    throw new Error("用户无权限操作");
  }

  if (!params) {
    throw new Error("参数错误");
  }
  const user = await app.models.User.findByPk(params.id);
  if (!user) {
    throw new Error("用户不存在");
  }
  await app.models.User.update(params, { where: { id: params.id } });
  return null;
};

/**
 * 分页查询用户
 * @param {*} app
 * @param {*} req
 * @returns
 */
const userQueryByPage = async (app, req) => {
  const params = await userQueryByPageDto.validateAsync(req.query);
  if (!params) {
    throw new Error("参数错误");
  }
  const { page_no, page_size, username, user_role } = params;
  const offset = (page_no - 1) * page_size;
  const limit = page_size;
  const whereCondition = {};
  if (username) {
    whereCondition.username = {
      [Op.like]: `%${username}%`,
    };
  }
  if (user_role) {
    whereCondition.user_role = user_role;
  }
  const { count, rows } = await app.models.User.findAndCountAll({
    offset,
    limit,
    where: whereCondition,
    order: [
      ["created_at", "DESC"],
      ["id", "DESC"],
    ],
    attributes: {
      exclude: ["deleted_at"],
    },
  });
  return {
    page_no,
    page_size,
    total: count,
    list: rows.map(getSafelyUser),
  };
};

/**
 * 用户脱敏
 * @param {*} app
 * @param {*} req
 * @returns
 */
const getSafelyUser = (user) => {
  return {
    id: user.id,
    username: user.username,
    user_avatar: user.user_avatar,
    user_profile: user.user_profile,
    vip_expire_time: user.vip_expire_time,
    vip_number: user.vip_number,
    share_code: user.share_code,
    user_role: user.user_role,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
};

module.exports = {
  userRegister,
  userLogin,
  userDelete,
  userUpdate,
  userQueryByPage,
  getLoginUser,
  userLogout,
  getLoginUserDetail,
  getUserDtailById,
};
