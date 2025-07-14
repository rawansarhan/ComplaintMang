const Joi = require('joi')

function HadithRecitationValidationOnline_create (data) {
  const schema = Joi.object({
    student_id: Joi.number().integer().required(),
    book_id: Joi.number().integer().required(),

    from_hadith: Joi.number().integer().required(),
    to_hadith: Joi.number().integer().required(),

    is_counted: Joi.boolean().required(),
    is_exam: Joi.boolean().required(),
    date: Joi.date().required()
  })
  return schema.validate(data)
}

/////upadte
function HadithRecitationValidationOnline_update (data) {
  const schema = Joi.object({
    from_hadith: Joi.number().integer().required(),
    to_hadith: Joi.number().integer().required(),

    is_counted: Joi.boolean().required(),
    is_exam: Joi.boolean().required(),
  })
  return schema.validate(data)
}

module.exports = {
  HadithRecitationValidationOnline_create,
  HadithRecitationValidationOnline_update
}
