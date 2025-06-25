const Joi = require('joi');

// create 
function ValidateCreateCircles(data) {
  const schema = Joi.object({
    circle_type_id: Joi.number().required(),
    name: Joi.string().required(),
    description: Joi.text().max(300),
    student_id: Joi.array().items(Joi.number()).min(1).required(),
    teacher_id: Joi.array().items(Joi.number()).min(1).required(),
  });

  return schema.validate(data);
}
///update
function ValidateUpdateCircles(data) {
  const schema = Joi.object({
    circle_type_id: Joi.number(),
    name: Joi.string(),
    description: Joi.string().max(300),
    student_id: Joi.array().items(Joi.number()).min(1).required(),
    teacher_id: Joi.array().items(Joi.number()).min(1).required(),
  });

  return schema.validate(data);
}
///delete user
function ValidateDeleteCircles(data) {
  const schema = Joi.object({
    user_id : Joi.number().required()
  });

  return schema.validate(data);
}
module.exports = {
  ValidateCreateCircles,
  ValidateUpdateCircles,
  ValidateDeleteCircles
};
