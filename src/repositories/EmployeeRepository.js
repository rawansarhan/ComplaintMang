const Employee = require('../models/Employee');

class EmployeeRepository {
  async create(employeeData) {
    const employee = await Employee.create(employeeData);
    return employee;
  }

  async findByUserId(user_id) {
    return await Employee.findOne({ where: { user_id } });
  }

  async update(id, updatedData) {
    const employee = await this.findById(id);
    if (!employee) return null;
    await employee.update(updatedData);
    return employee;
  }

  async delete(id) {
    const employee = await this.findById(id);
    if (!employee) return null;
    await employee.destroy();
    return true;
  }

  async findByGovernmentEntity(government_entity) {
    return await Employee.findAll({ where: { government_entity } });
  }
}

module.exports = new EmployeeRepository();
