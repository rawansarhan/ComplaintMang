const Joi = require('joi');

function quranRecitationValidation_create(data){
const schema = Joi.object({
  session_id: Joi.number().integer().required(),
  student_id: Joi.number().integer().required(),

  from_sura_id: Joi.number().integer().required(),
  from_verse: Joi.number().integer().required(),

  to_sura_id: Joi.number().integer().required(),
  to_verse: Joi.number().integer().required(),

  is_counted: Joi.boolean().required(),
  is_exam: Joi.boolean().required(),
  attendance: Joi.boolean().required()
});
 return schema.validate(data);
}

/////upadte
function quranRecitationValidation_update(data){
const schema = Joi.object({
  session_id: Joi.number(),
  student_id: Joi.number().integer(),

  from_sura_id: Joi.number().integer(),
  from_verse: Joi.number().integer().required(),

  to_sura_id: Joi.number().integer(),
  to_verse: Joi.number().integer(),

  is_counted: Joi.boolean(),
  is_exam: Joi.boolean(),
  attendance: Joi.boolean()
});
 return schema.validate(data);
}


module.exports = {
quranRecitationValidation_create,
quranRecitationValidation_update

};
