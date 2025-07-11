const Joi = require('joi');

function HadithBookValidation_create(data){
const schema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  pages_num: Joi.number().min(1).required(),
});
 return schema.validate(data);
}

/////upadte
function  HadithBookValidation_update(data){
const schema = Joi.object({
   name: Joi.string().min(3).max(100),
  pages_num: Joi.number().min(1),
});
 return schema.validate(data);
}




module.exports={
HadithBookValidation_create,
HadithBookValidation_update
}