const Joi = require('joi')


//register
function ValidateRegisterUser(data) {
  const schema = Joi.object({
    mosque_id: Joi.number().required(),
    first_name: Joi.string().trim().min(2).max(100).required(),
    last_name: Joi.string().trim().min(2).max(100).required(),

    phone: Joi.string().length(10).pattern(/^\d+$/).allow(null),
    father_phone: Joi.string().allow(null).length(10).pattern(/^\d+$/),

    birth_date: Joi.date().required(),
    email: Joi.string().email().trim().min(5).max(100).required(),
    password: Joi.string().min(6).max(20).required(),

    address: Joi.string().required(),
    certificates: Joi.string().optional().allow(null),
    experiences: Joi.string().optional().allow(null),
    memorized_parts: Joi.number().integer().min(0).max(30).required().allow(null),
    is_save_quran: Joi.boolean().required(),
    fcm_token: Joi.string().optional().allow(null, ''), // <-- أضفنا FCM Token

  }).or('phone', 'father_phone');

  return schema.validate(data);
}
///////////////////

/////////////////
function ValidateRegisterAdmin(data) {
  const schema = Joi.object({
    mosque_id: Joi.number().required(),
    first_name: Joi.string().trim().min(2).max(100).required(),
    last_name: Joi.string().trim().min(2).max(100).required(),
    phone: Joi.string()
      .length(10)
      .pattern(/^\d+$/)
      .optional()
      .allow(null, ''),
    birth_date: Joi.date().required(),
    email: Joi.string().email().trim().min(5).max(100).required(),
    password: Joi.string().min(6).max(20).required(),
    address: Joi.string().required(),
    experiences: Joi.string().optional().allow(null, ''),
    memorized_parts: Joi.number().integer().default(30),
    is_save_quran: Joi.boolean().default(true),
  });

  return schema.validate(data);
}


//login
function ValidateLoginUser(data) {
  const schema = Joi.object({
    code_user: Joi.string().min(3).max(50).required(),
    mosque_code: Joi.string().required(),
    fcm_token: Joi.string().optional().allow(null, '') // <-- إضافة FCM Token
  });

  return schema.validate(data);
}

//login for super Admin
function ValidateLoginSuperAdmin(data) {
  const schema = Joi.object({
    email: Joi.string().email().trim().min(5).max(100),
    password: Joi.string().min(6).max(20), 
  });

  return schema.validate(data);
}

///update
function ValidateUpdateUser(data) {
  const schema = Joi.object({
    first_name: Joi.string().trim().min(2).max(100),
    last_name: Joi.string().trim().min(2).max(100),

    phone: Joi.string().length(10).pattern(/^\d+$/).allow(null),
    father_phone: Joi.string().length(10).pattern(/^\d+$/).allow(null),

    birth_date: Joi.date(),
    email: Joi.string().email().trim().min(5).max(100),
    password: Joi.string().min(6).max(20).required(),

    address: Joi.string(),
    certificates: Joi.string().allow(null),
    experiences: Joi.string().allow(null),
    memorized_parts: Joi.number().integer().min(0).max(30).allow(null),
    is_save_quran: Joi.boolean()
  });

  return schema.validate(data);
}

module.exports = {
  ValidateRegisterUser,
  ValidateLoginUser,
  ValidateLoginSuperAdmin,
  ValidateUpdateUser,
  ValidateRegisterAdmin
}
