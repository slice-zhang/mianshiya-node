const Joi = require("joi");

const schema = Joi.object({
  title: Joi.string(),
  content: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  answer: Joi.string(),
  priority: Joi.number().integer().min(0),
  need_vip: Joi.number().integer().min(1).max(2),
  id: Joi.number().integer().min(1).required(),
  difficulty: Joi.number().integer().min(1).max(3),
});

module.exports = schema;
