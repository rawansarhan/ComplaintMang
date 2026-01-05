const asyncHandler = require('express-async-handler');
const { ValidateCreateComplaint } = require('../validations/complaintValidation');
const { 
  createComplaintService,
  getEmployeeComplaintsService,
  getUserComplaintsService,
  getAllComplaintsService ,
  getComplaintWithHistory,
  updateComplaintService,
  destroyComplaintForAdminAndEmp,
  destroyComplaintForcitizen,
  updateComplaintForCitizenService 
} = require('../services/Complaint');
const {Complaint ,Employee,Citizen,sequelize }= require('../entities');
const withTransaction = require('../Aspect/withTransaction');
const { sendNotification } = require('../services/notification.service')

//  create complaint
const createComplaint = asyncHandler(async (req, res) => {


  const complaintData = req.body;
  const files = req.files;

  const newComplaint = await createComplaintService(req.user.id, complaintData, files);

  return res.status(200).json({
    message: 'تم إنشاء الشكوى بنجاح!',
    complaint: newComplaint,
  });
});

/////update


const updateComplant = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({
    where: { user_id: req.user.id }
  });

  if (!employee) {
    return res.status(400).json({
      message: 'المستخدم ليس مسجلاً موظف بعد'
    });
  }

  const complaintId = Number(req.params.id);
  let updatedComplaint;

  await withTransaction(
    sequelize,
    async (transaction) => {
      updatedComplaint = await updateComplaintService(
        employee.id,
        complaintId,
        req.body,
        transaction
      );
    },
    {
      userId: req.user.id,
      service: 'update_complaint_employee'
    }
  );

  // 🔔 إرسال الإشعارات بعد نجاح الترانزكشن
  const citizen = await Citizen.findByPk(updatedComplaint.citizen_id, {
    include: [{ model: User, as: 'user', attributes: ['fcm_token'] }]
  });

  const token = citizen?.user?.fcm_token;

  if (token) {
    if (req.body.status) {
      sendNotification({
        token,
        title: 'Complaint Status Updated',
        body: `Your complaint status is now: ${req.body.status}`,
        data: {
          complaintId: updatedComplaint.id.toString(),
          type: 'STATUS_UPDATE'
        }
      }).catch(console.error);
    }

    if (req.body.notes) {
      sendNotification({
        token,
        title: 'New Note Added',
        body: 'An employee added a new note to your complaint',
        data: {
          complaintId: updatedComplaint.id.toString(),
          type: 'NEW_NOTE'
        }
      }).catch(console.error);
    }
  }

  return res.status(200).json({
    message: 'تم تعديل الشكوى بنجاح!',
    complaint: updatedComplaint
  });
});

/////update for Citizen
const updateComplantForCitizen = asyncHandler(async (req, res) => {
  const citizen = await Citizen.findOne({
    where: { user_id: req.user.id }
  });

  if (!citizen) {
    return res.status(400).json({
      message: 'المستخدم ليس مسجلاً مواطن بعد'
    });
  }

  const complaintID = Number(req.params.id);
  const images = req.files?.images?.map(
    f => `public/images/${f.filename}`
  ) || [];
  
  const attachments = req.files?.attachments?.map(
    f => `public/attachments/${f.filename}`
  ) || [];
  
  const updateData = {
    ...req.body,
    images,
    attachments
  };
  
  let updatedComplaint;

  await withTransaction(
    sequelize,
    async (transaction) => {
      updatedComplaint = await updateComplaintForCitizenService(
        citizen,
        complaintID,
        updateData,
        transaction
      );
    },
    {
      userId: req.user.id,
      service: 'update_complaint_citizen'
    }
  );

  return res.status(200).json({
    message: 'تم تعديل الشكوى بنجاح!',
    complaint: updatedComplaint
  });
});


/// get all complaint for admin
const showAllComplaints = asyncHandler(async (req, res) => {
  
  const page = parseInt(req.query.page) || 1;

  const pageSize = 3;

  const complaints = await getAllComplaintsService(page, pageSize);

  return res.status(200).json({
    success: true,
    ...complaints,
  });

});


// get all complaint for employee
const getEmployeeComplaintsController = asyncHandler(async (req, res) => {
 const employee = await Employee.findOne({ where: { user_id: req.user.id } });
  if (!employee) {
    return res.status(400).json({ message: 'المستخدم ليس مسجلاً موظف بعد' });
  }
  if (!employee.government_entity) {
    return res.status(400).json({
      message: 'لم يتم تحديد الجهة الحكومية لهذا الموظف'
    });
  }
 console.log(1)  
   const page = parseInt(req.query.page) || 1;


  const pageSize = 3;
 console.log(2)  

  const complaints = await getEmployeeComplaintsService(employee,page,pageSize);

  return res.json({
    success: true,
    complaints,
  });
});


//  get all complaint for citizen
const getMyComplaintsController = asyncHandler(async (req, res) => {
  const citizen = await Citizen.findOne({ where: { user_id: req.user.id } });
if (!citizen) {
  return res.status(400).json({ message: 'المستخدم ليس مسجلاً كمواطن بعد' });
}
  const page = parseInt(req.query.page) || 1;

  const pageSize = 3;
const citizenId = citizen.id;
  const complaints = await getUserComplaintsService(citizenId,page,pageSize);

  return res.json({
    success: true,
    complaints,
  });
});

//show details for the complaint
const getComplaintWithHistoryController = async (req, res, next) => {
  try {
    const complaintId = req.params.id;
    const data = await getComplaintWithHistory(complaintId);

    res.json({
      success: true,
      complaint: data.complaint,
      history: data.history
    });
  } catch (error) {
    next(error);
  }
};

/////////////////// delete for admin and employee
const deletedComplaintForAdminAndEmp = async (req, res, next) => {
  try {
    await withTransaction(
      sequelize,
      async (transaction) => {
        await destroyComplaintForAdminAndEmp(
          req.user.id,
          req.params.id,
          transaction
        );
      },
      {
        userId: req.user.id,
        service: 'delete_complaint_admin_employee'
      }
    );

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

////////////delete for citizen
const deletedComplaintForcitizen = async (req, res, next) => {
  try {
    const citizen = await Citizen.findOne({
      where: { user_id: req.user.id }
    });

    if (!citizen) {
      return res.status(400).json({
        message: 'المستخدم ليس مسجلاً كمواطن بعد'
      });
    }

    await withTransaction(
      sequelize,
      async (transaction) => {
        await destroyComplaintForcitizen(
          citizen,
          req.params.id,
          transaction
        );
      },
      {
        userId: req.user.id,
        service: 'delete_complaint_citizen'
      }
    );

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  createComplaint,
  showAllComplaints,
  getEmployeeComplaintsController,
  getMyComplaintsController,
  getComplaintWithHistoryController,
  updateComplant,
  deletedComplaintForAdminAndEmp,
  deletedComplaintForcitizen,
  updateComplantForCitizen
};
