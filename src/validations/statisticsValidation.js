const Joi = require('joi');

function statistics_create (data) {
  const schema = Joi.object({
    toDate: Joi.date().required(),
    fromDate : Joi.date().required()
  })
  return schema.validate(data)
}

module.exports = {
statistics_create
};
