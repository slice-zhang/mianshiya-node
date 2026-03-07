const Joi = require("joi");
const pageSchema = require("@/common/pageSchema");

const schema = Joi.object({
  ...pageSchema,
  username: Joi.string().alphanum(),
  user_role: Joi.number().integer().min(1),
});

module.exports = schema;
