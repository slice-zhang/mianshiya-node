const { DataTypes } = require("sequelize");
const dayjs = require("dayjs");
// 定义用户表Model
const User = {
  schema: {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      comment: "id",
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "密码",
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "用户名",
    },
    user_avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "用户头像",
    },
    user_profile: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "用户描述",
    },
    vip_expire_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "会员过期时间",
    },
    vip_number: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "会员编号",
    },
    share_code: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "分享码",
    },
    invite_user: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "邀请人id",
    },
    user_role: {
      type: DataTypes.INET,
      allowNull: false,
      defaultValue: 1,
      comment: "用户角色 1 普通用户 2 管理员 3 封禁",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "创建时间",
      get() {
        const rawValue = this.getDataValue("created_at");
        return rawValue ? dayjs(rawValue).format("YYYY-MM-DD HH:mm:ss") : null;
      },
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "更新时间",
      get() {
        const rawValue = this.getDataValue("updated_at");
        return rawValue ? dayjs(rawValue).format("YYYY-MM-DD HH:mm:ss") : null;
      },
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "软删除时间",
    },
  },
  options: {
    tableName: "user", // 对应数据库表名
    comment: "用户表",
    paranoid: true,
    charset: "utf8",
    collate: "utf8_general_ci",
    timestamps: true,
    createdAt: "created_at", // 映射到你的created_at
    updatedAt: "updated_at", // 映射到你的updated_at
    deletedAt: "deleted_at", // 软删除字段名
    indexes: [], // 无额外索引，主键已默认创建
  },
};

module.exports = User;
