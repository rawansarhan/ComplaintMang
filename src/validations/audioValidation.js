const Joi = require('joi');

// create 
function ValidateCreateAudio(data) {
  const schema = Joi.object({
    surah_id: Joi.number().required(),
    from_ayah_id: Joi.number().min(1).required(),
    to_ayah_id: Joi.number().greater(Joi.ref('from_ayah_id')).required(),
  });

  return schema.validate(data);
}
//// create comment

function ValidateCreateComment(data) {
  const schema = Joi.object({
    rate: Joi.number().min(1).max(5).required(),
    textComment: Joi.string().required(),
  });

  return schema.validate(data);
}
module.exports = {
  ValidateCreateAudio,
  ValidateCreateComment
};
