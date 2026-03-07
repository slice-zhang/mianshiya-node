// session的map key
const USER_SESSION_KEY = "user";

// 用户角色
const USER_ROLE = {
  USER: 1, // 普通用户
  ADMIN: 2, // 管理员
  BAN: 3, // 封禁
};

// 题目审核状态
const QUESTION_REVIEW_STATUS = {
  PENDING: 0, // 待审核
  ADULT_PASS: 1, // 审核成功
  ADULT_FAIL: 2, // 审核不通过
};

// 题目是否发布
const QUESTION_APPLICATION = {
  HAS_PUBLISH: 1, // 已发布
  NO_PUBLISH: 2, // 未发布
};

module.exports = {
  USER_SESSION_KEY,
  USER_ROLE,
  QUESTION_REVIEW_STATUS,
  QUESTION_APPLICATION,
};
