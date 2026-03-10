const { DataTypes } = require("sequelize");
const dayjs = require("dayjs");
const QuestionBank = {
  schema: {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      comment: "id",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "标题",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "描述",
    },
    picture: {
      type: DataTypes.STRING(2048),
      allowNull: true,
      comment: "图片",
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "创建的用户id",
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
    tableName: "question_bank",
    comment: "题库表",
    paranoid: true,
    charset: "utf8",
    collate: "utf8_general_ci",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    indexes: [
      {
        name: "idx_title",
        fields: ["title"], // 对应SQL中的idx_title索引
      },
    ],
  },
  associate: function (models) {
    models.QuestionBank.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
    models.QuestionBank.belongsToMany(models.Question, {
      through: "question_bank_question", // 中间表名
      as: "questionList", // 别名（查询时要用到）
      foreignKey: "question_bank_id", // 中间表中关联题库表的字段
      otherKey: "question_id", // 中间表中关联题目表的字段
      timestamps: true, // 中间表有 created_at/updated_at，需要开启
    });
  },
};

module.exports = QuestionBank;
