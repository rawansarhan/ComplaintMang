const {
  Complaint,
  Citizen,
  User,
  ActivityLog,
  Employee,
  ComplaintVersion,
  sequelize
} = require('../entities')

class ComplaintRepository {
  async findByReferenceNumber (reference_number) {
    return await Complaint.findOne({ where: { reference_number } })
  }

  async findByCitizenId (citizen_id) {
    return await Complaint.findAll({ where: { citizen_id } })
  }

  async findByPk (complaintId) {
    return await Complaint.findByPk(complaintId, {
      include: [
        {
          model: Citizen,
          as: 'citizen',
          include: [
            {
              model: User,
              as: 'user',
              attributes: [
                'id',
                'first_name',
                'last_name',
                'phone',
                'fcm_token'
              ]
            }
          ]
        },
        {
          model: Employee,
          as: 'employee',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'first_name', 'last_name', 'phone']
            }
          ]
        }
      ]
    })
  }
  async findAndCountAll ({ offset, employeeEntity,pageSize }) {
    return await Complaint.findAndCountAll({
      where: { government_entity: employeeEntity },
      include: [
        {
          model: Citizen,
          as: 'citizen',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'first_name', 'last_name', 'phone']
            }
          ]
        },
        {
          model: Employee,
          as: 'employee',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'first_name', 'last_name', 'phone']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']],
      limit: pageSize,
      offset
    })
  }
async findAndCountAllCitizen ({ offset, citizenId,pageSize }) {

  return await Complaint.findAndCountAll({
    where: { citizen_id: citizenId },
    include: [
      {
        model: Citizen,
        as: 'citizen',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'first_name', 'last_name', 'phone']
          }
        ]
      },
      {
        model: Employee,
        as: 'employee',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'first_name', 'last_name', 'phone']
          }
        ]
      }
    ],
    order: [['created_at', 'DESC']],
    limit: pageSize,
    offset
  })


}
  async update (id, updatedData) {
    const complaint = await this.findById(id)
    if (!complaint) return null
    await complaint.update(updatedData)
    return complaint
  }

  async delete (id) {
    const complaint = await this.findById(id)
    if (!complaint) return null
    await complaint.destroy()
    return true
  }
}

module.exports = new ComplaintRepository()
