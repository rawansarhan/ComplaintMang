const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');

const { 
  createComplaint,
  getEmployeeComplaintsController,
  getMyComplaintsController,
  showAllComplaints,
  getComplaintWithHistoryController,
  updateComplant
} = require('../controllers/complaintController');

const { 
  authMiddlewaree, 
  hasPermission 
} = require('../middlewares/authMiddleware');


/**
 * @swagger
 * /api/complaint/createComplaint:
 *   post:
 *     summary: create new complaint
 *     tags: [Complaint]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - governorate
 *               - government_entity
 *             properties:
 *               description:
 *                 type: string
 *                 example: "نعاني من انقطاع المياه منذ يومين بدون سابق إنذار."
 *               governorate:
 *                 type: string
 *                 example: "دمشق"
 *               location:
 *                 type: string
 *                 example: "حي السلام، شارع 5"
 *               government_entity:
 *                 type: string
 *                 example: "ماء"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: "ملفات الصور (يمكن رفع أكثر من ملف باستخدام Choose Files)"
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: "ملفات مرفقة أخرى (PDF, DOCX, ...) يمكن رفع أكثر من ملف"
 *     responses:
 *       200:
 *         description: تم إنشاء الشكوى بنجاح.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "تم إنشاء الشكوى بنجاح!"
 *                 complaint:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 101
 *                     description:
 *                       type: string
 *                       example: "نعاني من انقطاع المياه منذ يومين..."
 *                     governorate:
 *                       type: string
 *                       example: "دمشق"
 *                     location:
 *                       type: string
 *                       example: "حي السلام، شارع 5"
 *                     government_entity:
 *                       type: string
 *                       example: "ماء"
 *                     status:
 *                       type: string
 *                       example: "جديدة"
 *                     citizen_id:
 *                       type: integer
 *                       example: 12
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                     attachments:
 *                       type: array
 *                       items:
 *                         type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: خطأ في التحقق من صحة البيانات أو طلب غير صالح.
 *       500:
 *         description: خطأ داخلي في السيرفر.
 */


router.post(
  '/createComplaint',
  authMiddlewaree,
  hasPermission('citizen_create_complaint'),
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'attachments', maxCount: 5 }
  ]),
  createComplaint
);
/////////update 


/**
 * @swagger
 * /api/complaint/updateComplaintByEmployee/{id}:
 *   put:
 *     summary: update complaint => (employee)
 *     tags: [Complaint]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateComplaint'
 *     responses:
 *       200:
 *         description: complaint updated successfully
 */
router.put(
  '/updateComplaintByEmployee/:id',
  authMiddlewaree,
  hasPermission('employee_update_complaint'),
  updateComplant
);


//  Get Citizen Complaints => (Citizen)

/**
 * @swagger
 * /api/complaint/my-complaints:
 *   get:
 *     summary: Get paginated complaints for the logged-in citizen
 *     tags: [Complaint]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number (default = 1)
 *     responses:
 *       200:
 *         description: List of citizen complaints with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ComplaintCreateOutputDTO'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 12
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 2
 */

router.get(
  '/my-complaints',
  authMiddlewaree,
  hasPermission('citizen_view_complaints'),
  getMyComplaintsController
);

/**
 * @swagger
 * /api/complaint/employee-complaints:
 *   get:
 *     summary: Get all complaints assigned to the employee's government entity (with pagination)
 *     tags: [Complaint]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number (default = 1)
 *     responses:
 *       200:
 *         description: List of complaints for employee with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ComplaintCreateOutputDTO'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 45
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 */

router.get(
  '/employee-complaints',
  authMiddlewaree,
  hasPermission('employee_view_assigned_complaints'),
  getEmployeeComplaintsController
);


//  Get ALL Complaints => (Admin Only)

/**
 * @swagger
 * /api/complaint/all:
 *   get:
 *     summary: Get ALL complaints (Admin Only) - paginated (pageSize fixed at 10)
 *     tags: [Complaint]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of complaints with pagination (pageSize fixed to 10)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 */
router.get(
  '/all',
  authMiddlewaree,
  hasPermission('admin_view_all_complaints'),
  showAllComplaints
);

///

/**
 * @swagger
 * /api/complaint/history/{id}:
 *   get:
 *     summary: Get complaint details with history
 *     tags: [Complaint]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the complaint
 *     responses:
 *       200:
 *         description: Complaint details with history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 complaint:
 *                   $ref: '#/components/schemas/ComplaintUpdateOutputDTO'
 *                 history:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       changed_by:
 *                         type: integer
 *                       change_type:
 *                         type: string
 *                       old_value:
 *                         type: object
 *                       new_value:
 *                         type: object
 *                       changed_at:
 *                         type: string
 *                         format: date-time
 */
router.get(
  '/history/:id',
  authMiddlewaree,
  hasPermission('view_complaint_history'), 
  getComplaintWithHistoryController
);


module.exports = router;
