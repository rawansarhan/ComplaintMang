const {
  registerCitizen,
  loginStep1,
  verifyOtpStep2,
  registerEmployee,
  login,
  getAllPermission
} = require('../services/Auth')
const { Permission } = require('../entities')

class AuthController {
  // -------------------- Register Emolpyee--------------------
  async registerEmployee (req, res) {
    try {
      const result = await registerEmployee(req.body)
      return res.status(201).json({
        message: 'تم إنشاء الحساب بنجاح',
        data: result
      })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }
  // -------------------- Register Citizen--------------------
  async registerCitizen (req, res) {
    try {
      const result = await registerCitizen(req.body)
      return res.status(201).json({
        message: 'تم إنشاء الحساب بنجاح',
        data: result
      })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  // -------------------- Login admin and employee --------------------

  async login (req, res) {
    try {
      const result = await login(req.body)
      return res.status(200).json({
        message: 'تم إرسال رمز التحقق OTP بنجاح',
        data: result
      })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  // -------------------- Login Step 1 --------------------
  async loginStep1 (req, res) {
    try {
      const result = await loginStep1(req.body)
      return res.status(200).json({
        message: 'تم إرسال رمز التحقق OTP بنجاح',
        data: result
      })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  // -------------------- Verify OTP Step 2 --------------------
  async verifyOtp (req, res) {
    try {
      const result = await verifyOtpStep2(req.body)
      return res.status(200).json({
        message: 'تم تسجيل الدخول بنجاح',
        data: result
      })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  //-------------------get all permission---------///

  async getAllPermissionController (req,res) {
    const user_permission = await getAllPermission()

    return res.json({
      message :"get all permission for employee",
      user_permission
    })
  }
}
module.exports = new AuthController()
