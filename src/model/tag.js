const { DataTypes } = require("sequelize");
const dayjs = require("dayjs");
const Tag = {
  schema: {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      comment: "id",
    },
    // 标签名字段
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "标签名",
    },
    // 创建时间字段
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "创建时间",
      get() {
        const rawValue = this.getDataValue("updated_at");
        return rawValue ? dayjs(rawValue).format("YYYY-MM-DD HH:mm:ss") : null;
      },
    },
    // 更新时间字段
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
      comment: "更新时间",
      get() {
        const rawValue = this.getDataValue("updated_at");
        return rawValue ? dayjs(rawValue).format("YYYY-MM-DD HH:mm:ss") : null;
      },
    },
  },
  options: {
    tableName: "tag",
    comment: "标签表",
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
};

module.exports = Tag;
