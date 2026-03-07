const Joi = require("joi");

const schema = Joi.object({
  question_id: Joi.number().integer().min(1).required(),
  question_bank_id: Joi.number().integer().min(1).required(),
});

module.exports = schema;
