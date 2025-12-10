const Joi = require('joi')

/* ========================= REGISTER EMPLOYEE ========================= */

function ValidateRegisterEmployee (data) {
  const schema = Joi.object({
    first_name: Joi.string().trim().min(2).max(100).required(),
    last_name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required(),
    government_entity: Joi.string()
      .valid('كهرباء', 'ماء', 'صحة', 'تعليم', 'داخلية', 'مالية')
      .required(),
    permission_id: Joi.array().items(Joi.number().integer()).default([]) // ✅ تعديل هنا
  })

  return schema.validate(data)
}

/* ========================= REGISTER CITIZEN ========================= */
function ValidateRegisterCitizen (data) {
  const schema = Joi.object({
    first_name: Joi.string().trim().min(2).max(100).required(),
    last_name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
  })

  return schema.validate(data)
}

/* ========================= LOGIN (STEP 1) ========================= */
function ValidateLoginUser (data) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })

  return schema.validate(data)
}

/* ========================= SEND OTP (STEP 1) ========================= */
function ValidateSendOtp (data) {
  return Joi.object({
    email: Joi.string().email().required()
  }).validate(data)
}

/* ========================= VERIFY OTP (STEP 2) ========================= */
function ValidateVerifyOtp (data) {
  return Joi.object({
    session_id: Joi.string().uuid().required(), // ⬅️ بديل عن الإيميل
    otp: Joi.string().length(6).required()
  }).validate(data)
}

module.exports = {
  ValidateRegisterCitizen,
  ValidateRegisterEmployee,
  ValidateLoginUser,
  ValidateSendOtp,
  ValidateVerifyOtp
}
