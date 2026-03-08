const questionCreateDto = require("@/dto/questionCreateDto");
const { getLoginUser } = require("@/service/user");
const { Op } = require("sequelize");
const correlationQuestionBankDto = require("@/dto/correlationQuestionBankDto");
const questionAdultDto = require("@/dto/questionAdultDto");
const questionUpdateDto = require("@/dto/questionUpdateDto");
const questionQueryByPageDto = require("@/dto/questionQueryByPageDto");
/**
 * 创建题目
 * @param {*} app
 * @param {*} req
 * @returns
 */
const questionCreate = async (app, req) => {
  const params = await questionCreateDto.validateAsync(req.body);
  const question = await app.models.Question.findOne({
    where: {
      title: params.title,
    },
  });
  if (question) {
    throw new Error("题目已存在");
  }

  // 校验标题长度
  if (params.title.length < 1 || params.title.length > 100) {
    throw new Error("题目长度必须在1-100之间");
  }

  // 获取合法的标签
  const tagList = await app.models.Tag.findAll();
  params.tags = params.tags
    .filter((tag) => tagList.some((i) => i.name === tag))
    .filter(Boolean);

  // 每个用户每天只能上传50到题目
  const currentUser = getLoginUser(req);
  const count = await app.models.Question.count({
    where: {
      user_id: currentUser.id,
      created_at: {
        [Op.gte]: new Date(new Date().toDateString()),
      },
    },
  });
  if (count >= 50) {
    throw new Error("每天只能上传50道题目");
  }

  await app.models.Question.create({
    title: params.title,
    content: params.content,
    tags: params.tags,
    answer: params.answer,
    priority: params.priority,
    user_id: currentUser.id,
    difficulty: params.difficulty,
  });

  return null;
};

/**
 * 关联题库
 * @param {*} app
 * @param {*} req
 * @returns
 */
const correlationQuestionBank = async (app, req) => {
  const params = await correlationQuestionBankDto.validateAsync(req.body);
  const { question_id, question_bank_id } = params;
  const currentUser = getLoginUser(req);
  try {
    await app.models.QuestionBankQuestion.create({
      question_id,
      question_bank_id,
      user_id: currentUser.id,
    });
  } catch (error) {
    throw new Error("无法重复关联");
  }

  return null;
};

/**
 * 取消关联题库
 * @param {*} app
 * @param {*} req
 * @returns
 */
const relinkQuestionBank = async (app, req) => {
  const params = await correlationQuestionBankDto.validateAsync(req.body);
  const { question_id, question_bank_id } = params;

  await app.models.QuestionBankQuestion.destroy({
    where: {
      question_id,
      question_bank_id,
    },
  });

  return null;
};

/**
 * 删除题目
 * @param {*} app
 * @param {*} req
 * @returns
 */
const questionDelete = async (app, req) => {
  const currentUser = getLoginUser(req);
  const { id } = req.query;
  if (!id) {
    throw new Error("id必传");
  }
  const question = await app.models.Question.findByPk(id);
  if (!question) {
    throw new Error("题目不存在");
  }

  if (currentUser.id !== question.user_id) {
    throw new Error("非题目创建者，无权限操作");
  }

  const count = await app.models.QuestionBankQuestion.count({
    where: {
      question_id: id,
    },
  });

  if (count > 0) {
    throw new Error("题目已被应用，无法删除");
  }

  await app.models.Question.destroy({
    where: {
      id,
    },
  });
  return null;
};

/**
 * 获取题目详情
 * @param {*} app
 * @param {*} req
 * @returns
 */
const questionDetail = async (app, req) => {
  const { id } = req.query;
  const question = await app.models.Question.findByPk(id, {
    attributes: {
      exclude: ["deleted_at"],
    },
  });
  if (!question) {
    throw new Error("题目不存在");
  }
  return question;
};

/**
 * 题目审核
 * @param {*} app
 * @param {*} req
 * @returns
 */
const questionAdult = async (app, req) => {
  const userInfo = getLoginUser(req);
  const params = await questionAdultDto.validateAsync(req.body);
  const { id, remark, adult_status } = params;
  const questionBank = await app.models.Question.findByPk(id);
  if (!questionBank) {
    throw new Error("题库不存在");
  }
  if (questionBank.user_id !== userInfo.id) {
    throw new Error("非题库创建者，无权限操作");
  }
  await app.sequelize.transaction(async (t) => {
    await app.models.Question.update(
      {
        adult_status,
      },
      { where: { id } },
      { transaction: t },
    );
    await app.models.questionAdultLog.create(
      {
        question_id: id,
        adult_status,
        remark: remark || "",
        user_id: userInfo.id,
      },
      { transaction: t },
    );
  });
};

/**
 * 获取题目审核日志
 * @param {*} app
 * @param {*} req
 * @returns
 */
const questionAdultLogs = async (app, req) => {
  const { question_id } = req.query;
  const { rows } = await app.models.questionAdultLog.findAndCountAll({
    where: { question_id },
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
 * 更新题目
 * @param {*} app
 * @param {*} req
 * @returns
 */
const questionUpdate = async (app, req) => {
  const params = await questionUpdateDto.validateAsync(req.body);
  const currentUser = getLoginUser(req);
  const questionBank = await app.models.Question.findByPk(params.id);
  if (!questionBank) {
    throw new Error("题库不存在");
  }
  if (questionBank.user_id !== currentUser.id) {
    throw new Error("非题库创建者，无权限操作");
  }
  // 获取合法的标签
  const tagList = await app.models.Tag.findAll();
  params.tags = params.tags.filter((tag) =>
    tagList.some((i) => i.name === tag),
  );

  await app.models.Question.update(params, {
    where: { id: params.id },
  });
  return null;
};

/**
 * 分页查询题目
 * @param {*} app
 * @param {*} req
 * @returns
 */
const questionQueryByPage = async (app, req) => {
  const params = await questionQueryByPageDto.validateAsync(req.query);
  const {
    id,
    page_no,
    page_size,
    title,
    tags,
    need_vip,
    difficulty,
    adult_status,
  } = params;
  const offset = (page_no - 1) * page_size;
  const limit = page_size;
  const whereCondition = {};
  if (title) {
    whereCondition.title = {
      [Op.like]: `%${title}%`,
    };
  }
  if (tags && tags.length > 0) {
    whereCondition[Op.and] = tags.map((tag, index) => ({
      [Op.and]: app.sequelize.fn(
        "JSON_CONTAINS",
        app.sequelize.col("tags"), // 字段名（避免引号问题）
        app.sequelize.fn("JSON_ARRAY", tag), // 生成 JSON_ARRAY('标签值')
      ),
    }));
  }
  adult_status && (whereCondition.adult_status = adult_status);
  need_vip && (whereCondition.need_vip = need_vip);
  difficulty && (whereCondition.difficulty = difficulty);
  id && (whereCondition.id = id);
  const { count, rows } = await app.models.Question.findAndCountAll({
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

module.exports = {
  questionCreate,
  questionDelete,
  correlationQuestionBank,
  relinkQuestionBank,
  questionDetail,
  questionAdult,
  questionAdultLogs,
  questionUpdate,
  questionQueryByPage,
};
