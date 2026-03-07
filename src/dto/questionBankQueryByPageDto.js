const Joi = require("joi");
const pageSchema = require("@/common/pageSchema");

const schema = Joi.object({
  ...pageSchema,
  title: Joi.string(),
  adult_status: Joi.number().integer(),
});

module.exports = schema;
