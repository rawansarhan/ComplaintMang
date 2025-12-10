const Complaint = require('../models/Complaint');

class ComplaintRepository {


  async findByReferenceNumber(reference_number) {
    return await Complaint.findOne({ where: { reference_number } });
  }

  async findByCitizenId(citizen_id) {
    return await Complaint.findAll({ where: { citizen_id } });
  }

  async update(id, updatedData) {
    const complaint = await this.findById(id);
    if (!complaint) return null;
    await complaint.update(updatedData);
    return complaint;
  }

  async delete(id) {
    const complaint = await this.findById(id);
    if (!complaint) return null;
    await complaint.destroy();
    return true;
  }
}

module.exports = new ComplaintRepository();
