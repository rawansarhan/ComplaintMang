// UserOutputDTO:  register
class UserRegisterOutputDTO {
  constructor ({ id, first_name, last_name, email,phone,fcm_token, created_at, updated_at }) {
    this.id = id
    this.first_name = first_name
    this.last_name = last_name
    this.email = email
    this.phone = phone
    this.created_at = created_at
    this.updated_at = updated_at
    this.fcm_token = fcm_token
  }
}

class UserLoginOutputDTO {
  constructor ({ id,first_name,last_name,email}) {
     this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = this.email;
  }
}

module.exports = {
  UserLoginOutputDTO,
  UserRegisterOutputDTO
}
