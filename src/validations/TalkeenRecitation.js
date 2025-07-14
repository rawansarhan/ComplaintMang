const Joi = require('joi');

function TalkeenRecitationValidation_create(data){
const schema = Joi.object({
  session_id: Joi.number().integer().required(),
  student_id: Joi.number().integer().required(),

  from_sura_id: Joi.number().integer().required(),
  from_verse: Joi.number().integer().required(),

  to_sura_id: Joi.number().integer().required(),
  to_verse: Joi.number().integer().required(),

  attendance: Joi.boolean().required()
});
 return schema.validate(data);
}

/////upadte
function TalkeenRecitationValidation_update(data){
const schema = Joi.object({
  session_id: Joi.number(),
  student_id: Joi.number().integer(),

  from_sura_id: Joi.number().integer(),
  from_verse: Joi.number().integer().required(),

  to_sura_id: Joi.number().integer(),
  to_verse: Joi.number().integer(),

  attendance: Joi.boolean()
});
 return schema.validate(data);
}


module.exports = {
TalkeenRecitationValidation_create,
TalkeenRecitationValidation_update

};
