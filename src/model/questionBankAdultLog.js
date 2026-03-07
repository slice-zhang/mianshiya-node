const { DataTypes } = require("sequelize");
const dayjs = require("dayjs");
const questionBankAdultLog = {
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
      comment: "题库id",
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "审核人id",
    },
    adult_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "审核状态 1 待审核 2 审核成功 3 审核失败",
    },
    remark: {
      type: DataTypes.STRING(512),
      allowNull: true,
      comment: "审核信息",
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
  },
  options: {
    tableName: "question_bank_adult_log",
    comment: "题库审核日志表",
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [],
  },
  associate: function (models) {
    models.questionBankAdultLog.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  },
};

module.exports = questionBankAdultLog;
