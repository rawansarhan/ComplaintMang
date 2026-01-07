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
  ValidateUpdateEmpComplaint,
  ValidateUpdateCitiComplaint
} = require('../validations/complaintValidation')
const client = require('../config/redis')
const ComplaintRepository = require('../repositories/ComplaintRepository')
const withTransaction = require('../Aspect/withTransaction') 

const AppError = require('../errors/AppError') // خطأ عام
const ValidationError = require('../errors/ValidationError')

async function createComplaintService(userID, complaintData, files) {

    const citizen = await Citizen.findOne({ where: { user_id: userID } })
    if (!citizen) {
      throw new ValidationError('المستخدم ليس مسجلاً كمواطن بعد')
    }

    const citizenId = citizen.id
    const images = files?.images?.map(f => `public/images/${f.filename}`) || []
    const attachments = files?.attachments?.map(f => `public/attachments/${f.filename}`) || []

    const dataToValidate = { ...complaintData, images, attachments }
    const { error } = ValidateCreateComplaint(dataToValidate)
    if (error) throw new ValidationError(error.details[0].message)

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
      images: Array.isArray(inputComplaintDTO.images) ? inputComplaintDTO.images : [],
      attachments: Array.isArray(inputComplaintDTO.attachments) ? inputComplaintDTO.attachments : []
    }

    const reference_number = await Complaint.generateReferenceNumber(dbData.government_entity)
    dbData.reference_number = reference_number

    await client.del('all_complaints')

    const complaint = await Complaint.create(dbData)
    const plainComplaint = complaint.get({ plain: true })

    await ActivityLog.create(
      {
        user_id: citizen.user_id,
        action: 'Create_Complaint',
        entity_type: 'Complaint',
        entity_id: complaint.id,
        description: 'Complaint created',
        metadata: { created_fields: plainComplaint }
      }
    )

    return new ComplaintCreateOutputDTO(plainComplaint)
  
}
/*
update for employee
*/


async function updateComplaintService(
  employeeID,
  complaintId,
  updateData,
  transaction
) {
  const complaint = await Complaint.findOne({
    where: { id: complaintId },
    transaction,
    lock: transaction.LOCK.UPDATE
  });

  if (!complaint) {
    throw new AppError(
      'الشكوى غير موجودة أو قيد المعالجة حالياً',
      404,
      'COMPLAINT_NOT_FOUND_OR_LOCKED'
    );
  }

  const beforeData = complaint.get({ plain: true });

  await client.del('all_complaints');

  const updatedComplaint = await complaint.update(
    {
      ...updateData,
      responsible_id: employeeID
    },
    { transaction }
  );

  const afterData = updatedComplaint.get({ plain: true });

  const lastVersion = await ComplaintVersion.max('version_number', {
    where: { complaint_id: complaintId },
    transaction
  });

  const newVersionNumber = (lastVersion || 0) + 1;

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
  );

  await ActivityLog.create(
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
  );

  return new ComplaintUpdateOutputDTO(updatedComplaint);
}
//////update for citizen
async function updateComplaintForCitizenService(
  citizen,
  complaintId,
  updateData,
  transaction
) {
  // 1️⃣ Validate input
  const { error, value } = ValidateUpdateCitiComplaint(updateData);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  // 2️⃣ Find complaint (ownership + lock)
  const complaint = await Complaint.findOne({
    where: {
      id: complaintId,
      citizen_id: citizen.id
    },
    transaction,
    lock: transaction.LOCK.UPDATE
  });

  if (!complaint) {
    throw new AppError(
      'الشكوى غير موجودة أو لا تملك صلاحية تعديلها',
      404,
      'COMPLAINT_NOT_FOUND'
    );
  }

  const beforeData = complaint.get({ plain: true });

  // 3️⃣ Clear cache
  await client.del('all_complaints');

  // 4️⃣ Build update payload (only provided fields)
  const updatePayload = {};
  if ('description' in value) updatePayload.description = value.description;
  if ('images' in value) updatePayload.images = value.images;
  if ('attachments' in value) updatePayload.attachments = value.attachments;

  const updatedComplaint = await complaint.update(updatePayload, {
    transaction
  });

  const afterData = updatedComplaint.get({ plain: true });

  // 5️⃣ Activity log (correct user_id)
  await ActivityLog.create(
    {
      user_id: citizen.user_id,
      action: 'UPDATE_COMPLAINT_BY_CITIZEN',
      entity_type: 'Complaint',
      entity_id: complaint.id,
      description: 'Complaint updated by citizen',
      metadata: {
        changed_fields: Object.keys(updatePayload),
        before: {
          description: beforeData.description,
          images: beforeData.images,
          attachments: beforeData.attachments
        },
        after: {
          description: afterData.description,
          images: afterData.images,
          attachments: afterData.attachments
        }
      }
    },
    { transaction }
  );

  return updatedComplaint;
}


/**
 * Get all complaints (admin view) with caching
 */
async function getAllComplaintsService (page, pageSize) {
  const cacheKey = `complaints:all:page:${page}`

  const cached = await client.get(cacheKey)
  if (cached) {
    console.log('⚡ Complaints from Redis cache')
    return JSON.parse(cached)
  }

  console.log('🐢 Complaints from DATABASE')

  const offset = (page - 1) * pageSize

  const { rows, count: total } = await ComplaintRepository.findAndCountAllAdmin(
    { offset,
     pageSize}
   )


  const data = rows.map(c => new ComplaintCreateOutputDTO(c))

  const result = {
    data,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  }

  await client.setEx(cacheKey, 60, JSON.stringify(result))

  return result
}

/**
 * Get complaints for a specific citizen (with pagination + redis cache)
 */
async function getUserComplaintsService (citizenId, page, pageSize) {
  const cacheKey = `complaints:citizen:${citizenId}:page:${page}`

  const cached = await client.get(cacheKey)
  if (cached) {
    console.log('⚡ Citizen complaints from Redis cache')
    return JSON.parse(cached)
  }

  console.log('🐢 Citizen complaints from DATABASE')

  const offset = (page - 1) * pageSize

  const { rows, count: total } = 
  await ComplaintRepository.findAndCountAllCitizen(
    { offset,
      citizenId,
     pageSize}
   )

  const data = rows.map(c => new ComplaintCreateOutputDTO(c))

  const result = {
    data,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  }

  await client.setEx(cacheKey, 60, JSON.stringify(result))

  return result
}

/**
 * Get complaints for a specific employee based on their government entity
 */
async function getEmployeeComplaintsService(employee, page = 1, pageSize = 10) {
  if (!employee || !employee.government_entity) {
    throw new Error('Invalid employee data')
  }

  page = Math.max(1, Number(page))
  pageSize = Math.max(1, Number(pageSize))

  const employeeEntity = employee.government_entity
  const cacheKey = `complaints:employee:${employeeEntity}:page:${page}:size:${pageSize}`

  const cached = await client.get(cacheKey)
  if (cached) {
    console.log('⚡ Employee complaints from Redis cache')
    return JSON.parse(cached)
  }

  console.log('🐢 Employee complaints from DATABASE')

  const offset = (page - 1) * pageSize

  const { rows, count: total } =
    await ComplaintRepository.findAndCountAll(
     { offset,
      employeeEntity,
      pageSize}
    )

  const data = rows.map(c => new ComplaintCreateOutputDTO(c))

  const result = {
    data,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  }

  await client.setEx(cacheKey, 60, JSON.stringify(result))

  return result
}


/**
 * Get a single complaint with history/details
 */
async function getComplaintWithHistory (complaintId) {
  const complaint = await ComplaintRepository.findByPk(complaintId)
  if (!complaint) throw new Error('Complaint not found')

  return {
    complaint: new ComplaintUpdateOutputDTO(complaint)
  }
}

/////////delete complaint for admin and employee
async function destroyComplaintForAdminAndEmp(
  user_id,
  complaintId,
  transaction
) {
  await client.del('all_complaints');

  const deleted = await ComplaintRepository.delete(
    complaintId,
    transaction
  );

  if (!deleted) {
    throw new AppError(
      'الشكوى غير موجودة',
      404,
      'COMPLAINT_NOT_FOUND'
    );
  }

  await ActivityLog.create(
    {
      user_id,
      action: 'DELETE_COMPLAINT',
      entity_type: 'Complaint',
      entity_id: complaintId,
      description: 'Complaint deleted by admin/employee'
    },
    { transaction }
  );

  return true;
}

////// delete complaint for citizen
async function destroyComplaintForcitizen(
  citizen,
  complaintId,
  transaction
) {
  await client.del('all_complaints');

  const deleted = await ComplaintRepository.deleteMyComplaint(
    citizen.id,
    complaintId,
    transaction
  );

  if (!deleted) {
    throw new AppError(
      'الشكوى غير موجودة أو لا تملك صلاحية حذفها',
      404,
      'COMPLAINT_NOT_FOUND'
    );
  }

  await ActivityLog.create(
    {
      user_id: citizen.user_id,
      action: 'DELETE_COMPLAINT_BY_CITIZEN',
      entity_type: 'Complaint',
      entity_id: complaintId,
      description: 'Complaint deleted by citizen'
    },
    { transaction }
  );

  return true;
}


module.exports = {
  createComplaintService,
  getAllComplaintsService,
  getUserComplaintsService,
  getEmployeeComplaintsService,
  getComplaintWithHistory,
  updateComplaintService,
  updateComplaintForCitizenService,
  destroyComplaintForAdminAndEmp,
  destroyComplaintForcitizen
}
