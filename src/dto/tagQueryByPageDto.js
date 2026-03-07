const Joi = require("joi");
const pageSchema = require("@/common/pageSchema");

const schema = Joi.object({
  ...pageSchema,
  name: Joi.string().alphanum(),
});

module.exports = schema;
