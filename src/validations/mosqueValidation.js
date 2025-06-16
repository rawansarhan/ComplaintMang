const Joi = require('joi');
/////add:
function ValidateMosqueCraete(data) {
  const schema = Joi.object({
    name: Joi.string()
      .pattern(/^[\p{L}\d ]+$/u) 
      .trim()
      .min(2)
      .max(100)
      .required(),

    address: Joi.string()
      .pattern(/^[\p{L}\d ]+$/u) 
      .trim()
      .min(2)
      .max(100)
      .required(),
  });

  return schema.validate(data);
}


////update:
function ValidateMosqueUpdate(data) {
  const schema = Joi.object({
    name: Joi.string()
      .pattern(/^[\p{L}\d ]+$/u) 
      .trim()
      .min(2)
      .max(100)
  ,

    address: Joi.string()
      .pattern(/^[\p{L}\d ]+$/u) 
      .trim()
      .min(2)
      .max(100)
    
  });

  return schema.validate(data);
}
module.exports = {
  ValidateMosqueCraete,
  ValidateMosqueUpdate
};
