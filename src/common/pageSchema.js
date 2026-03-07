const Joi = require("joi");
module.exports = {
  page_size: Joi.number().integer().min(1).required(),
  page_no: Joi.number().integer().min(1).required(),
};
