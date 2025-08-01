const Joi = require('joi');
/////////////////////
function SessionLesson_create(data){
const schema = Joi.object({
  title: Joi.string().min(3).max(400).required(),
  date: Joi.date().required(),
  description:Joi.string().min(3).max(400).required(),
});
 return schema.validate(data);
}
////////////////
function SessionLesson_update(data){
const schema = Joi.object({
  title: Joi.string().min(3).max(400),
  date: Joi.date(),
  description:Joi.string().min(3).max(400),
});
 return schema.validate(data);
}
////////
function session_attendance_create(data){
const schema = Joi.object({
    student_id: Joi.array().items(Joi.number()).min(1).required(),
});
 return schema.validate(data);
}
////////////////
function session_attendance_update(data){
const schema = Joi.object({
    student_id: Joi.array().items(Joi.number()).min(1),
});
 return schema.validate(data);
}

////////////////create exam
function exam_create(data){
const schema = Joi.object({
  title: Joi.string().min(3).max(400).required,
  date: Joi.date().required,
  description:Joi.string().min(3).max(400),
});
 return schema.validate(data);
}
//////////
function exam_update(data){
const schema = Joi.object({
  title: Joi.string().min(3).max(400),
  date: Joi.date(),
  description:Joi.string().min(3).max(400),
});
 return schema.validate(data);
}
/////
function Add_marks(data){
const schema = Joi.object({
   data: Joi.array().items(
      Joi.object({
        student_id: Joi.number().integer().required(),
        score : Joi.number().integer().required(),
        notes : Joi.string().min(3).max(400),
        has_taken_exam: Joi.boolean().required()
      })
    ).required()
});
 return schema.validate(data);}
 ////////////////
 function Update_marks(data){
const schema = Joi.object({
   data: Joi.array().items(
      Joi.object({
        score : Joi.number().integer(),
        notes : Joi.string().min(3).max(400),
        has_taken_exam: Joi.boolean()
      })
    ).required()
});
 return schema.validate(data);}

module.exports = {
SessionLesson_create,
session_attendance_create,
SessionLesson_update,
session_attendance_update,
exam_create,
exam_update,
Add_marks,
Update_marks
};