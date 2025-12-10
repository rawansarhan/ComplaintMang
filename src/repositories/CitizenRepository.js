const Citizen = require('../models/Citizen');

class CitizenRepository {

  async findByUserId(user_id) {
    return await Citizen.findOne({ where: { user_id } });
  }

  async update(id, updatedData) {
    const citizen = await this.findById(id);
    if (!citizen) return null;
    await citizen.update(updatedData);
    return citizen;
  }

  async delete(id) {
    const citizen = await this.findById(id);
    if (!citizen) return null;
    await citizen.destroy();
    return true;
  }
}

module.exports = new CitizenRepository();
