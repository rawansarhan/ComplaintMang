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


////////////////create exam
function exam_create(data){
  const schema = Joi.object({
    title: Joi.string().min(3).max(400).required(), 
    date: Joi.date().required(),                         
    description: Joi.string().min(3).max(400)            
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
function Add_marks(data) {
  const schema = Joi.object({
    data: Joi.array().items(
      Joi.object({
        student_id: Joi.number().integer().required(),
        score: Joi.number().integer().min(0).max(100).required(),
        notes: Joi.string().min(3).max(400).optional(),
        has_taken_exam: Joi.boolean().required()
      })
    ).min(1).required()
  });
  return schema.validate(data);
}

 

module.exports = {
SessionLesson_create,
session_attendance_create,
SessionLesson_update,
exam_create,
exam_update,
Add_marks,
};