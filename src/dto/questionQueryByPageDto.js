const Joi = require("joi");
const pageSchema = require("@/common/pageSchema");
const schema = Joi.object({
  ...pageSchema,
  title: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  need_vip: Joi.number().integer().min(1).max(2),
  difficulty: Joi.number().integer().min(1).max(3),
  adult_status: Joi.number().integer().min(1).max(3),
});

module.exports = schema;
