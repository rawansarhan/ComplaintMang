const Joi = require('joi');

function quranRecitationValidationOnline_create(data){
const schema = Joi.object({
  student_id: Joi.number().integer().required(),

  from_sura_id: Joi.number().integer().required(),
  from_verse: Joi.number().integer().required(),

  to_sura_id: Joi.number().integer().required(),
  to_verse: Joi.number().integer().required(),

  is_counted: Joi.boolean().required(),
  is_exam: Joi.boolean().required(),
   date:Joi.date().required()
});
 return schema.validate(data);
}

/////upadte
function quranRecitationValidationOnline_update(data){
const schema = Joi.object({


  from_sura_id: Joi.number().integer().required(),
  from_verse: Joi.number().integer().required(),

  to_sura_id: Joi.number().integer().required(),
  to_verse: Joi.number().integer().required(),

  is_counted: Joi.boolean().required(),
  is_exam: Joi.boolean().required(),
   date:Joi.date().required()
});
 return schema.validate(data);
}


module.exports = {
quranRecitationValidationOnline_create,
quranRecitationValidationOnline_update

};
