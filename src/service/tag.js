const { Op } = require("sequelize");
const tagQueryByPageDto = require("@/dto/tagQueryByPageDto");

/**
 * 新增标签
 * @param {*} app
 * @param {*} req
 * @returns
 */
const tagCreate = async (app, req) => {
  const { name } = req.body;
  if (!name || !String(name || "").trim().length) {
    throw new Error("name参数不能为空");
  }

  const tag = await app.models.Tag.findOne({
    where: {
      name,
    },
  });

  if (tag) {
    throw new Error("标签已存在");
  }

  await app.models.Tag.create({
    name,
  });

  return null;
};

/**
 * 删除标签
 * @param {*} app
 * @param {*} req
 * @returns
 */
const tagDelete = async (app, req) => {
  const { id } = req.query;
  if (!id) {
    throw new Error("id必填");
  }

  const tag = await app.models.Tag.findByPk(id);
  if (!tag) {
    throw new Error("标签不存在");
  }
  await app.models.Tag.destroy({
    where: {
      id,
    },
  });
  return null;
};

/**
 * 更新标签
 * @param {*} app
 * @param {*} req
 * @returns
 */
const tagUpdate = async (app, req) => {
  const { name, id } = req.body;
  if (!id) {
    throw new Error("id必填");
  }
  if (!name || !String(name || "").trim().length) {
    throw new Error("name必填");
  }
  const tag = await app.models.Tag.findByPk(id);
  if (!tag) {
    throw new Error("标签不存在");
  }

  await app.models.Tag.update(
    { name },
    {
      where: {
        id,
      },
    }
  );

  return null;
};

/**
 * 分页查询标签
 * @param {*} app
 * @param {*} req
 * @returns
 */
const tagQueryByPage = async (app, req) => {
  const { page_no, page_size, name } = await tagQueryByPageDto.validateAsync(
    req.query
  );
  const offset = (page_no - 1) * page_size;
  const limit = page_size;
  const whereCondition = {};
  if (name && name.trim().length) {
    whereCondition.name = {
      [Op.like]: `%${name}%`,
    };
  }

  const { count, rows } = await app.models.Tag.findAndCountAll({
    offset,
    limit,
    where: whereCondition,
    order: [
      ["created_at", "DESC"],
      ["id", "ASC"],
    ],
  });
  return {
    page_no,
    page_size,
    total: count,
    list: rows,
  };
};

const getTagDetail = async (app, req) => {
  const { id } = req.query;
  if (!id) {
    throw new Error("id必填");
  }
  const tag = await app.models.Tag.findByPk(id);
  if (!tag) {
    throw new Error("标签不存在");
  }
  return tag;
};

module.exports = {
  tagCreate,
  tagDelete,
  tagUpdate,
  tagQueryByPage,
  getTagDetail,
};
