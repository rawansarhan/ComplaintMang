const Joi = require('joi');
/////add:
function ValidateSessionCraete(data) {
  const schema = Joi.object({
    circle_id: Joi.number().required(),
    date: Joi.date().required(),
    description:Joi.string().min(20).max(200).allow("")
  });

  return schema.validate(data);
}



module.exports = {
ValidateSessionCraete
};
