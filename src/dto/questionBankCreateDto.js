const Joi = require("joi");

const schema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  picture: Joi.string(),
  priority: Joi.number().integer().min(0),
});

module.exports = schema;
