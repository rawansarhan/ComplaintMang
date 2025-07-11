const Joi = require('joi');

// create 
function ValidateCreateChallange(data) {
  const schema = Joi.object({
     student_id: Joi.array().items(Joi.number()).min(1).required(),
     teacher_id: Joi.array().items(Joi.number()).min(1).required(),
  });

  return schema.validate(data);
}
/////////////
function ValidateCreate1Challange(deta){
  const schema = Joi.object({
  taskQuranId: Joi.number().integer().required(),
});
  return schema.validate(data);
}
/////////////////////
function ValidateCreate2Challange(deta){
  const schema = Joi.object({
  data: Joi.array().items(
    Joi.object({
      task_id: Joi.number().integer().required(),
      lavel_id: Joi.number().integer().required()
    })
  ).required()
});
  return schema.validate(data);
}
/////////
function ValidateTeacherChallange(deta){
  const schema = Joi.object({
  
    data: Joi.array().items(
    Joi.object({
      task_id: Joi.number().integer().required(),
      id_done: Joi.boolean().required()
    })
  ).required()
 
});
  return schema.validate(data);
}


module.exports={
ValidateCreateChallange,ValidateCreate2Challange ,ValidateCreate1Challange,ValidateTeacherChallange
}