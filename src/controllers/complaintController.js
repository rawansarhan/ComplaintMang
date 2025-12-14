const asyncHandler = require('express-async-handler');
const { ValidateCreateComplaint } = require('../validations/complaintValidation');
const { 
  createComplaintService,
  getEmployeeComplaintsService,
  getUserComplaintsService,
  getAllComplaintsService ,
  getComplaintWithHistory,
  updateComplaintService
} = require('../services/Complaint');
const {Complaint ,Employee,Citizen }= require('../entities');


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
  const employee = await Employee.findOne({ where: { user_id: req.user.id } });
  if (!employee) {
    return res.status(400).json({ message: 'المستخدم ليس مسجلاً موظف بعد' });
  }

  const employeeID = employee.id;

  const complaintID = Number(req.params.id); 

  const updateComplaint = await updateComplaintService(employeeID, complaintID, req.body);

  return res.status(200).json({
    message: 'تم تعديل الشكوى بنجاح!',
    complaint: updateComplaint,
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
   const page = parseInt(req.query.page) || 1;

  const pageSize = 3;
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



module.exports = { 
  createComplaint,
  showAllComplaints,
  getEmployeeComplaintsController,
  getMyComplaintsController ,
  getComplaintWithHistoryController,
  updateComplant
};
