// UserInputDTO: register for admin
class UserRegisterInputDTO {
  constructor({ first_name, last_name, email, password,phone,role_id ,fcm_token}) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.password = password;
    this.phone = phone
    this.role_id = role_id;
    this.fcm_token = fcm_token
  }
}

// Login DTO
class UserLoginInputDTO {
  constructor({ email, password }) {
    this.email = email;
    this.password = password;
  }
}

// OTP (Login Step 1) - Send OTP
class SendOtpInputDTO {
  constructor({ email }) {
    this.email = email;
  }
}

// OTP (Verify Step 2)
class VerifyOtpInputDTO {
  constructor({ session_id, otp }) {
    this.session_id = session_id;
    this.otp = otp;
  }
}

module.exports = {
  UserRegisterInputDTO,
  UserLoginInputDTO,
  SendOtpInputDTO,
  VerifyOtpInputDTO
};
