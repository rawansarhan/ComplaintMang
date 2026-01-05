const { error } = require('winston')
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


  async findAndCountAllAdmin ({ offset,pageSize }) {
    const all = await Complaint.findAndCountAll({
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
      offset: offset
    })
    if (all.length === 0) {
      return  error("you are not have complaint yet");
    }
    return all
  }
  async findAndCountAll({ offset, employeeEntity, pageSize }) {
    const all = await Complaint.findAndCountAll({
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
    });
  
    if (all.length === 0) {
      return  error("you are not have complaint yet");
    }
  
    return all;
  }
  
async findAndCountAllCitizen ({ offset, citizenId,pageSize }) {

  const all =await Complaint.findAndCountAll({
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
  if (all.length === 0) {
    return  error("you are not have complaint yet");
  }
  return all

}
  async update (id, updatedData) {
    const complaint = await this.findById(id)
    if (!complaint) return null
    await complaint.update(updatedData)
    return complaint
  }

 // Admin & Employee
 async delete(complaintId, options = {}) {
  const complaint = await Complaint.findOne({
    where: {
      id: complaintId
    },
    ...options
  });

  if (!complaint) return false;

  await complaint.destroy(options);
  return true;
}
// citizen
async deleteMyComplaint(citizenId, complaintId, options = {}) {
  const complaint = await Complaint.findOne({
    where: {
      id: complaintId,
      citizen_id: citizenId
    },
    ...options
  });

  if (!complaint) return false;

  await complaint.destroy(options);
  return true;
}

}

module.exports = new ComplaintRepository()
