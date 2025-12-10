const {
  ComplaintCreateInputDTO,
  ComplaintUpdateInputDTO
} = require('../dto/ComplaintInputDTO')
const {
  ComplaintCreateOutputDTO,
  ComplaintUpdateOutputDTO
} = require('../dto/ComplaintOutputDTO')
const {
  Complaint,
  Citizen,
  User,
  ActivityLog,
  Employee,
  ComplaintVersion,
  sequelize
} = require('../entities')
const {
  ValidateCreateComplaint,
  ValidateUpdateEmpComplaint
} = require('../validations/complaintValidation')

async function createComplaintService (userID, complaintData, files) {
  const transaction = await sequelize.transaction()
 const citizen = await Citizen.findOne({ where: { user_id: userID } });
if (!citizen) {
  return res.status(400).json({ message: 'المستخدم ليس مسجلاً كمواطن بعد' });
}

const citizenId = citizen.id; 
  try {
   
    const images = files?.images?.map(f => `public/images/${f.filename}`) || []
    const attachments =
      files?.attachments?.map(f => `public/attachments/${f.filename}`) || []

    const dataToValidate = { ...complaintData, images, attachments }

  
    const { error } = ValidateCreateComplaint(dataToValidate)
    if (error) throw new Error(error.details[0].message)

   
    const inputComplaintDTO = new ComplaintCreateInputDTO({
      ...complaintData,
      citizen_id: citizenId,
      status: 'جديدة',
      images,
      attachments
    })

 
    const dbData = {
      ...inputComplaintDTO,
      responsible_id: null,
      images: Array.isArray(inputComplaintDTO.images)
        ? inputComplaintDTO.images
        : [],
      attachments: Array.isArray(inputComplaintDTO.attachments)
        ? inputComplaintDTO.attachments
        : []
    }

   
    const reference_number = await Complaint.generateReferenceNumber(
      dbData.government_entity,
      transaction
    )

    dbData.reference_number = reference_number
    console.log('Generated reference_number:', reference_number)


    const complaint = await Complaint.create(dbData, { transaction })

    console.log('Complaint created ID:', complaint.id)

   
    const plainComplaint = complaint.get({ plain: true })

    const history = await ActivityLog.create(
      {
        user_id: citizen.user_id,
        action: 'Create_Complaint',
        entity_type: 'Complaint',
        entity_id: complaint.id,
        description: 'Complaint created',
        metadata: {
          created_fields: plainComplaint 
        }
      },
      { transaction }
    )

    console.log('===== Activity Log (DETAILS) =====')
    console.log({
      id: history.id,
      user_id: history.user_id,
      action: history.action,
      entity_type: history.entity_type,
      entity_id: history.entity_id,
      description: history.description,
      metadata: history.metadata,
      created_at: history.created_at
    })
    console.log('==================================')

    
    await transaction.commit()

    return new ComplaintCreateOutputDTO(plainComplaint)
  } catch (err) {
    console.error('=== ERROR in createComplaintService ===')
    console.error(err)

    await transaction.rollback()
    throw err
  }
}

///////update

async function updateComplaintService (employeeID, complaintId, updateData) {
  const sequelize = Complaint.sequelize

  const transaction = await sequelize.transaction()
  const startTime = new Date()

  try {
    const complaint = await Complaint.findOne({
      where: { id: complaintId },
      transaction,
      lock: {
        level: transaction.LOCK.UPDATE,
        skipLocked: true
      }
    })

    if (!complaint) {
      await transaction.rollback()
      throw new Error(
        'This transaction is currently being processed by another employee. Please try again later.'
      )
    }

    const beforeData = complaint.get({ plain: true })

    const updatedComplaint = await complaint.update(
      {
        ...updateData,
        responsible_id: employeeID
      },
      { transaction }
    )

    const afterData = updatedComplaint.get({ plain: true })

    const endTime = new Date()

    const lastVersion = await ComplaintVersion.max('version_number', {
      where: { complaint_id: complaintId },
      transaction
    })

    const newVersionNumber = (lastVersion || 0) + 1

    await ComplaintVersion.create(
      {
        complaint_id: complaint.id,
        employee_id: employeeID,
        version_number: newVersionNumber,
        before_data: beforeData,
        after_data: afterData,
        change_summary: `Complaint updated by employee ${employeeID}`
      },
      { transaction }
    )

    const history = await ActivityLog.create(
      {
        user_id: employeeID,
        action: 'UPDATE_COMPLAINT',
        entity_type: 'Complaint',
        entity_id: complaint.id,
        description: 'Complaint updated',
        metadata: {
          changed_fields: Object.keys(updateData)
        }
      },
      { transaction }
    )

    console.log({
      started_at: startTime,
      ended_at: endTime,
      duration_ms: endTime - startTime
    })
    console.log(history)

    await transaction.commit()
    return new ComplaintUpdateOutputDTO(updatedComplaint)
  } catch (err) {
    await transaction.rollback()
    throw err
  }
}

/**
 * Get all complaints (admin view)
 */
async function getAllComplaintsService () {
  const complaints = await Complaint.findAll({
    include: [
      {
        model: Citizen,
        as: 'citizen', // يجب أن يطابق الـ association
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
        as: 'employee', // يجب أن يطابق الـ association
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'first_name', 'last_name', 'phone']
          }
        ]
      }
    ],
    order: [['created_at', 'DESC']]
  })

  return complaints.map(c => new ComplaintCreateOutputDTO(c))
}

/**
 * Get complaints for a specific citizen
 */
async function getUserComplaintsService (citizenId) {
  const complaints = await Complaint.findAll({
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
    order: [['created_at', 'DESC']]
  })

  return complaints.map(c => new ComplaintCreateOutputDTO(c))
}

/**
 * Get complaints for a specific employee based on their government entity
 */
async function getEmployeeComplaintsService (employee) {
  const employeeEntity = employee.government_entity

  const complaints = await Complaint.findAll({
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
    order: [['created_at', 'DESC']]
  })
  if (!complaints) {
    throw new Error('not have any complaint yet.')
  }

  return complaints.map(c => new ComplaintCreateOutputDTO(c))
}

/**
 * Get a single complaint with history/details
 */
async function getComplaintWithHistory (complaintId) {
  const complaint = await Complaint.findByPk(complaintId, {
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
    ]
  })

  if (!complaint) throw new Error('Complaint not found')

  return {
    complaint: new ComplaintUpdateOutputDTO(complaint)
  }
}

module.exports = {
  createComplaintService,
  getAllComplaintsService,
  getUserComplaintsService,
  getEmployeeComplaintsService,
  getComplaintWithHistory,
  updateComplaintService
}
