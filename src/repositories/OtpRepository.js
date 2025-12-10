const Otps = {};

class OtpRepository {
  async saveOtp(session_id, otp, email) { 
    Otps[session_id] = { 
      otp, 
      email, 
      expires: Date.now() + 5 * 60 * 1000 
    };
  }

  async verifyOtp(session_id, otp) {
    const record = Otps[session_id];
    if (!record) return null;
    if (record.otp !== otp) return null;
    if (Date.now() > record.expires) {
      delete Otps[session_id];
      return null;
    }
    return record; 
  }

  async deleteOtp(session_id) {
    delete Otps[session_id];
  }
}

module.exports = new OtpRepository();
