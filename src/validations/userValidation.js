const Joi = require('joi')


//register
function ValidateRegisterUser(data) {
  const schema = Joi.object({
    mosque_id: Joi.number().required(),
    first_name: Joi.string().trim().min(2).max(100).required(),
    last_name: Joi.string().trim().min(2).max(100).required(),

    phone: Joi.string().optional().allow(null),
    father_phone: Joi.string().optional().allow(null),

    birth_date: Joi.date().required(),
    email: Joi.string().email().trim().min(5).max(100),
    password: Joi.string().min(6).max(20),

    address: Joi.string().required().allow(null),
    certificates: Joi.string().optional().allow(null),
    experiences: Joi.string().optional().allow(null),
    memorized_parts: Joi.number().integer().min(0).required().allow(null),
    is_save_quran: Joi.boolean().required(),
  }).or('phone', 'father_phone'); 

  return schema.validate(data);
}
//login
function ValidateLoginUser(data) {
  const schema = Joi.object({
    code_user: Joi.string().min(3).max(50).required(),
    mosque_code: Joi.string().required() 
  });

  return schema.validate(data);
}


module.exports = {
  ValidateRegisterUser,
  ValidateLoginUser
}
