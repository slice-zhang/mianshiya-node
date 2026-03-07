const Joi = require("joi");

const schema = Joi.object({
  id: Joi.number().integer().required(),
  adult_status: Joi.number().integer().required(),
  remark: Joi.string(),
});

module.exports = schema;
