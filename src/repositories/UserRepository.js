const User = require('../models/User');

class UserRepository {

  // البحث عن مستخدم بواسطة البريد الإلكتروني
  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  // تحديث مستخدم
  async update(id, updatedData) {
    const user = await this.findById(id);
    if (!user) return null;
    await user.update(updatedData);
    return user;
  }

  // حذف مستخدم
  async delete(id) {
    const user = await this.findById(id);
    if (!user) return null;
    await user.destroy();
    return true;
  }

  // البحث عن مستخدم بواسطة id
  async findById(id) {
    return await User.findByPk(id);
  }
}

module.exports = new UserRepository();
