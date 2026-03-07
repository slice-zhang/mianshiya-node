const Joi = require("joi");

const schema = Joi.object({
  id: Joi.number().integer().min(1).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  user_avatar: Joi.string(),
  user_profile: Joi.string(),
});

module.exports = schema;
