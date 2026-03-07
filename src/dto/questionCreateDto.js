const Joi = require("joi");

const schema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
  answer: Joi.string().required(),
  need_vip: Joi.number().integer().min(0).max(1),
  priority: Joi.number().integer().min(0),
  difficulty: Joi.number().integer().min(1).required(),
});

module.exports = schema;
