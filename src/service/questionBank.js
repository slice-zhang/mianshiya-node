const questionBankCreateDto = require("@/dto/questionBankCreateDto");
const questionBankUpdateDto = require("@/dto/questionBankUpdateDto");
const questionBankQueryByPageDto = require("@/dto/questionBankQueryByPageDto");
const questionBankReviewDto = require("@/dto/questionBankReviewDto");
const { getLoginUser } = require("@/service/user");
const { Op } = require("sequelize");
const { includes } = require("lodash-es");

/**
 * 新增题库
 * @param {*} app
 * @param {*} req
 * @returns
 */
const questionBankCreate = async (app, req) => {
  const params = await questionBankCreateDto.validateAsync(req.body);

  const currentUser = getLoginUser(req);
  const { title, description, picture, priority } = params;
  const questionBank = await app.models.QuestionBank.findOne({
    where: { title },
  });

  if (questionBank) {
    throw new Error("题库已存在");
  }

  const count = await app.models.QuestionBank.count({
    where: {
      user_id: currentUser.id,
    },
  });

  if (count > 50) {
    throw new Error("今日已达创建题库上限");
  }

  await app.models.QuestionBank.create({
    title,
    description,
    picture,
    priority,
    user_id: currentUser.id,
  });
  return null;
};

/**
 * 删除题库
 * @param {*} app
 * @param {*} req
 * @returns
 */
const questionBankDelete = async (app, req) => {
  const { id } = req.query;
  const currentUser = getLoginUser(req);
  const questionBank = await app.models.QuestionBank.findByPk(id);

  if (!questionBank) {
    throw new Error("题库不存在");
  }

  if (questionBank.user_id !== currentUser.id) {
    throw new Error("非题库创建者，无权限操作");
  }

  const linkData = await app.models.QuestionBankQuestion.count({
    where: {
      question_bank_id: id,
    },
  });
  if (linkData) {
    throw new Error("该题库下存在题目，无法删除");
  }
  await app.models.QuestionBank.destroy({
    where: { id },
  });
  return null;
};

/**
 * 更新题库
 * @param {*} app
 * @param {*} req
 * @returns
 */
const questionBankUpdate = async (app, req) => {
  const params = await questionBankUpdateDto.validateAsync(req.body);
  const currentUser = getLoginUser(req);
  const questionBank = await app.models.QuestionBank.findByPk(params.id);
  if (!questionBank) {
    throw new Error("题库不存在");
  }
  if (questionBank.user_id !== currentUser.id) {
    throw new Error("非题库创建者，无权限操作");
  }
  await app.models.QuestionBank.update(params, {
    where: { id: params.id },
  });
  return null;
};

/**
 * 分页查询题库
 * @param {*} app
 * @param {*} req
 * @returns
 */
const questionBankQueryByPage = async (app, req) => {
  const params = await questionBankQueryByPageDto.validateAsync(req.query);
  const { id, page_no, page_size, title, adult_status } = params;
  const offset = (page_no - 1) * page_size;
  const limit = page_size;
  const whereCondition = {};
  if (title) {
    whereCondition.title = {
      [Op.like]: `%${title}%`,
    };
  }
  id && (whereCondition.id = id);
  adult_status && (whereCondition.adult_status = adult_status);
  const { count, rows } = await app.models.QuestionBank.findAndCountAll({
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
    include: [
      {
        model: app.models.User,
        attributes: ["username"],
        as: "user",
      },
    ],
  });
  return {
    page_no,
    page_size,
    total: count,
    list: rows,
  };
};

/**
 * 题库审核
 * @param {*} app
 * @param {*} req
 * @returns
 */
const questionBankAdult = async (app, req) => {
  const userInfo = getLoginUser(req);
  const params = await questionBankReviewDto.validateAsync(req.body);
  const { id, remark, adult_status } = params;
  const questionBank = await app.models.QuestionBank.findByPk(id);
  if (!questionBank) {
    throw new Error("题库不存在");
  }
  if (questionBank.user_id !== userInfo.id) {
    throw new Error("非题库创建者，无权限操作");
  }
  await app.sequelize.transaction(async (t) => {
    await app.models.QuestionBank.update(
      {
        adult_status,
      },
      { where: { id } },
      { transaction: t },
    );
    await app.models.questionBankAdultLog.create(
      {
        question_bank_id: id,
        adult_status,
        remark: remark || "",
        user_id: userInfo.id,
      },
      { transaction: t },
    );
  });
};

/**
 * 获取题库审核日志
 * @param {*} app
 * @param {*} req
 * @returns
 */
const questionBankAdultLogs = async (app, req) => {
  const { question_bank_id } = req.query;
  const { rows } = await app.models.questionBankAdultLog.findAndCountAll({
    where: { question_bank_id },
    attributes: ["id", "created_at", "remark"],
    include: [
      {
        model: app.models.User,
        attributes: ["username"],
        as: "user",
      },
    ],
  });
  return rows;
};

/**
 * 获取题库详情
 * @param {*} app
 * @param {*} req
 * @returns
 */
const questionBankDetailById = async (app, req) => {
  const { id, need_question_list } = req.query;
  const questionBank = await app.models.QuestionBank.findOne({
    where: {
      id,
      adult_status: 2,
    },
    include: need_question_list
      ? [
          {
            where: {
              adult_status: 2,
            },
            model: app.models.Question,
            as: "questionList",
          },
        ]
      : [],
    attributes: {
      exclude: ["deleted_at"],
    },
  });
  if (!questionBank) {
    throw new Error("题库不存在");
  }
  return questionBank;
};

module.exports = {
  questionBankCreate,
  questionBankUpdate,
  questionBankDelete,
  questionBankQueryByPage,
  questionBankAdult,
  questionBankAdultLogs,
  questionBankDetailById,
};
