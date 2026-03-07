const bcryptjs = require("bcryptjs");

// 密码加密
async function hashPassword(plainPassword) {
  const salt = await bcryptjs.genSalt(10);
  const hash = await bcryptjs.hash(plainPassword, salt);
  return hash;
}

// 验证密码（比对明文和哈希值）
async function verifyPassword(plainPassword, hashedPassword) {
  const isMatch = await bcryptjs.compare(plainPassword, hashedPassword);
  return isMatch;
}

module.exports = {
  hashPassword,
  verifyPassword,
};
