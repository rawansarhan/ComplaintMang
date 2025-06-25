// Validation
function ValidateDeleteCircles(data) {
  const schema = Joi.object({
    circle_id: Joi.number().required(),
    user_id : Joi.number().required()
  });

  return schema.validate(data);
}

const express = require('express');
const router = express.Router();
const {
  createCircle,
  updateCircle,
  deleteCircle,
  showWithId,
  showAll,
  deleteCircleUser,
  show_circle_for_teacher
  
} = require('../controllers/circleController');
const {
  authMiddleware,
  studentOnly,
  teacherOnly,
  adminOnly,
  superAdminOnly,
  authorizeRoles
} = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Circle
 *   description: Circle creation and management
 */

/**
 * @swagger
 * /api/circle/create:
 *   post:
 *     summary: Create a new circle
 *     tags: [Circle]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mosque_id
 *               - circle_type_id
 *               - name
 *               - description
 *               - student_id
 *               - teacher_id
 *             properties:
 *               mosque_id:
 *                 type: integer
 *               circle_type_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               student_id:
 *                 type: array
 *                 items:
 *                   type: integer
 *               teacher_id:
 *                 type: array
 *                 items:
 *                   type: integer
 *           example:
 *             mosque_id: 1
 *             circle_type_id: 2
 *             name: "Evening Quran Class"
 *             description: "Evening memorization group"
 *             student_id: [4, 5, 6]
 *             teacher_id: [2]
 *     responses:
 *       201:
 *         description: Circle created successfully
 *       400:
 *         description: Validation error or bad request
 *       404:
 *         description: Mosque not found
 */
router.post('/create', authMiddleware, adminOnly, createCircle);

/**
 * @swagger
 * /api/circle/update/{id}:
 *   put:
 *     summary: Update an existing circle
 *     tags: [Circle]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the circle to retrieve
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - circle_type_id
 *               - name
 *               - description
 *               - student_id
 *               - teacher_id
 *             properties:
 *               circle_type_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               student_id:
 *                 type: array
 *                 items:
 *                   type: integer
 *               teacher_id:
 *                 type: array
 *                 items:
 *                   type: integer
 *           example:
 *             circle_type_id: 2
 *             name: "Evening Quran Class"
 *             description: "Updated description"
 *             student_id: [4, 5, 6]
 *             teacher_id: [2]
 *     responses:
 *       200:
 *         description: Circle updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Circle not found
 */
router.put('/update/:id', updateCircle);

/**
 * @swagger
 * /api/circle/deleteCircleUser/{id}:
 *   delete:
 *     summary: Delete a circle
 *     tags: [Circle]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the circle to retrieve
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: integer
 *           example:
 *             user_id: 2
 *     responses:
 *       200:
 *         description: CircleUser deleted successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Unauthorized to delete circleUser
 *       404:
 *         description: CircleUser not found
 */
router.delete('/delete/:id', deleteCircleUser);
/**
 * @swagger
 * /api/circle/deleteCircle/{id}:
 *   delete:
 *     summary: Delete a circle
 *     tags: [Circle]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the circle to retrieve      
 *     responses:
 *       200:
 *         description: Circle deleted successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Unauthorized to delete circle
 *       404:
 *         description: Circle not found
 */
router.delete('/deleteCircle/:id', deleteCircle);
/**
 * @swagger
 * /api/circle/showAll:
 *   get:
 *     summary: Get all circles with their associated users (teachers and students)
 *     tags: [Circle]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved circles with users
 *       500:
 *         description: Internal server error
 */

router.get('/showAll',authMiddleware,adminOnly,showAll);
/*/**
 * @swagger
 * /api/circle/showWithId/{id}:
 *   get:
 *     summary: Get circle by ID (with teachers and students)
 *     tags: [Circle]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the circle to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the circle with its users
 *       400:
 *         description: Invalid circle ID
 *       404:
 *         description: Circle not found
 *       500:
 *         description: Internal server error
 */
router.get('/showWithId/:id', showWithId);
/*
 * @swagger
 * /api/circle/show_circle_for_teacher
 *   get:
 *     summary: Get circles for teacher(onlyTeacher,)
 *     tags: [Circle]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the circle with its users
 *       400:
 *         description: Invalid circle ID
 *       404:
 *         description: Circle not found
 *       500:
 *         description: Internal server error
 */
router.get('/show_circle_for_teacher', show_circle_for_teacher);


module.exports = router;
