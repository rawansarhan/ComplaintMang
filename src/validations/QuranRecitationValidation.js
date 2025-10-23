const Joi = require('joi')

function quranRecitationValidation_create (data) {
  const schema = Joi.object({
    session_id: Joi.number().integer().positive().required(),
    student_id: Joi.number().integer().positive().required(),

    from_sura_id: Joi.number().integer().positive().required(),
    from_verse: Joi.number().integer().positive().required(),

    to_sura_id: Joi.number().integer().positive().required(),
    to_verse: Joi.number().integer().positive().required(),

    is_counted: Joi.boolean().required(),
    is_exam: Joi.boolean().required(),
    attendance: Joi.boolean().required(),

    new_pages: Joi.number().integer().min(0).max(604).required()
  })

  return schema.validate(data)
}

/////upadte
function quranRecitationValidation_update (data) {
  const schema = Joi.object({
    from_sura_id: Joi.number().integer(),
    from_verse: Joi.number().integer().required(),

    to_sura_id: Joi.number().integer(),
    to_verse: Joi.number().integer(),

    is_counted: Joi.boolean(),
    is_exam: Joi.boolean(),
    new_pages: Joi.number().integer().min(0).max(604)
  })
  return schema.validate(data)
}

module.exports = {
  quranRecitationValidation_create,
  quranRecitationValidation_update
}
