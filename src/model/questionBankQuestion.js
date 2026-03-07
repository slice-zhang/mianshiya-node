const { DataTypes } = require("sequelize");

const QuestionBankQuestion = {
  schema: {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      comment: "id",
    },
    question_bank_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "题库 id",
    },
    question_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "题目 id",
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "创建用户 id",
    },
    create_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "创建时间",
    },
    update_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "更新时间",
    },
  },
  options: {
    tableName: "question_bank_question",
    comment: "题库题目",
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    timestamps: false,
    indexes: [
      {
        name: "unique_question_bank_question",
        fields: ["questionBankId", "questionId"],
        unique: true, // 对应SQL中的UNIQUE约束
      },
    ],
  },
};
module.exports = QuestionBankQuestion;
