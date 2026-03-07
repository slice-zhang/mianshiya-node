const Joi = require("joi");

const schema = Joi.object({
  username: Joi.string().alphanum().required(),
  password: Joi.string().alphanum().required(),
  invite_user: Joi.number().integer().min(1),
});

module.exports = schema;
