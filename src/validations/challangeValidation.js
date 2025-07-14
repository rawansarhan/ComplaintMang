const Joi = require('joi');

// create 
function ValidateCreateChallange(data) {
  const schema = Joi.object({
    student_id: Joi.number().integer().required(),
  });

  return schema.validate(data);
}
/////////////
function ValidateCreate1Challange(data){
  const schema = Joi.object({
  taskQuranId: Joi.number().integer().required(),
});
  return schema.validate(data);
}
/////////////////////
function ValidateCreate2Challange(data){
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
function ValidateTeacherChallange(data){
  const schema = Joi.object({
  
    data: Joi.array().items(
    Joi.object({
      task_id: Joi.number().integer().required(),
      is_done: Joi.boolean().required()
    })
  ).required()
 
});
  return schema.validate(data);
}


module.exports={
ValidateCreateChallange,ValidateCreate2Challange ,ValidateCreate1Challange,ValidateTeacherChallange
}