const Joi = require('joi');
/////add:
function ValidateSessionCraete(data) {
  const schema = Joi.object({
    circle_id: Joi.number().required(),
    date: Joi.date().required(),
  });

  return schema.validate(data);
}



module.exports = {
ValidateSessionCraete
};
