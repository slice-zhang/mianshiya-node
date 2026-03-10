const { DataTypes } = require("sequelize");
const Question = {
  schema: {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      comment: "id",
    },
    title: {
      type: DataTypes.STRING(256),
      allowNull: false,
      comment: "标题",
    },
    difficulty: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: "难度",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "内容",
    },
    tags: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      comment: "标签列表（json 数组）",
      // 可选：添加字段转换，自动解析/序列化JSON
      get() {
        const value = this.getDataValue("tags");
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        this.setDataValue("tags", JSON.stringify(value));
      },
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "推荐答案",
    },
    adult_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "审核状态 1 待审核 2 审核成功 3 审核失败",
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "排序",
    },
    need_vip: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1,
      comment: "是否需要vip查看 1 不需要 2 需要",
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "创建用户 id",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "创建时间",
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "更新时间",
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "软删除时间",
    },
  },
  options: {
    tableName: "question",
    comment: "题目",
    paranoid: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    indexes: [
      {
        name: "idx_title",
        fields: ["title"],
      },
      {
        name: "idx_userId",
        fields: ["userId"],
      },
    ],
  },
  associate: function (models) {
    models.Question.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  },
};

module.exports = Question;
