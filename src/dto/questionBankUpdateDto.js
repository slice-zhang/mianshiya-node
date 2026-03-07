const Joi = require("joi");

const schema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  picture: Joi.string(),
  priority: Joi.number().integer().min(0),
  id: Joi.number().integer().min(1).required(),
  view_num: Joi.number().integer(),
});

module.exports = schema;
