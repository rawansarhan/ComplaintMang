const Joi = require('joi');

/* ========================= CREATE COMPLAINT ========================= */
function ValidateCreateComplaint(data) {
  const schema = Joi.object({
    governorate: Joi.string()
      .valid(
        'دمشق', 'ريف دمشق', 'حمص', 'حماة', 'حلب',
        'اللاذقية', 'طرطوس', 'إدلب',
        'الرقة', 'دير الزور', 'الحسكة',
        'السويداء', 'درعا', 'القنيطرة'
      )
      .required(),

    government_entity: Joi.string()
      .valid('كهرباء', 'ماء', 'صحة', 'تعليم', 'داخلية', 'مالية')
      .required(),

    location: Joi.string().allow(null, ''),

    description: Joi.string().max(2000).allow(null, ''),

    images: Joi.array().items(Joi.string()).default([]),

    attachments: Joi.array().items(Joi.string()).default([])
  });

  return schema.validate(data);
} 

/* ========================= UPDATE COMPLAINT by employee ========================= */
function ValidateUpdateEmpComplaint(data) {
  const schema = Joi.object({
    notes: Joi.string().max(4000).allow(null, ''),
    status :Joi.string().
      valid( 'جديدة',
          'بانتظار معلومات اضافية',
          'قيد المعالجة',
          'منجزة',
          'مرفوضة'
        )

  });

  return schema.validate(data);
}

//===========================Update Complaint By Citizen==========================//

function ValidateUpdateCitiComplaint(data) {
  const schema = Joi.object({
    description: Joi.string().max(2000).allow(null, ''),

    images: Joi.array().items(Joi.string()).default([]),

    attachments: Joi.array().items(Joi.string()).default([])
  });

  return schema.validate(data);
}

module.exports = {
  ValidateCreateComplaint,
  ValidateUpdateCitiComplaint,
  ValidateUpdateEmpComplaint
};
