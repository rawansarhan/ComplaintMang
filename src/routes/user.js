const express = require('express');
const router = express.Router();
const { updateUser ,userAllShow,userDelete,userShowById,userDeleteForAdmin ,userShowMyProfile, getAllAdmins } = require('../controllers/UserController');
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
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/user/updateUser/{id}:
 *   put:
 *     summary: Update a user's profile =>(admin)
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               father_phone:
 *                 type: string
 *               birth_date:
 *                 type: string
 *                 format: date
 *               email:
 *                 type: string
 *                 format: email
 *               address:
 *                 type: string
 *               certificates:
 *                 type: string
 *               experiences:
 *                 type: string
 *               memorized_parts:
 *                 type: integer
 *               is_save_quran:
 *                 type: boolean
 *             example:
 *               first_name: "hanan"
 *               last_name: "Hassan"
 *               phone: "0999888777"
 *               father_phone: "0999111222"
 *               birth_date: "2000-01-01"
 *               email: "hanan@gmail.com"
 *               address: "Damascus"
 *               certificates: "High School"
 *               experiences: "3 years teaching"
 *               memorized_parts: 20
 *               is_save_quran: true
 *              
 *     responses:
 *       '200':
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Database error
 */

router.put('/updateUser/:id', authMiddleware,adminOnly,updateUser);
/**
 * @swagger
 * /api/user/showAllUser:
 *   get:
 *     summary: Get all users (students and teachers separately)=>(adminOnly)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 students:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 teachers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */

router.get('/showAllUser',authMiddleware,adminOnly,userAllShow);

/**
 * @swagger
 * /api/user/showUserById/{id}:
 *   get:
 *     summary: Get a user by ID => (admin)
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: user ID
 *     responses:
 *       200:
 *         description: user data
 *       404:
 *         description: user not found
 *       500:
 *         description: Internal server error
 */
router.get('/showUserById/:id',authMiddleware,adminOnly,userShowById);
/**
 * @swagger
 * /api/user/showUserById:
 *   get:
 *     summary: Get a user by ID => (my profile)
 *     tags: [User]

 *     responses:
 *       200:
 *         description: user data
 *       404:
 *         description: user not found
 *       500:
 *         description: Internal server error
 */
router.get('/showUserById',authMiddleware,userShowMyProfile);
/**
 * @swagger
 * /api/user/delete/{id}:
 *   delete:
 *     summary: Delete a user (AdminOnly)
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.delete('/delete/:id',authMiddleware,adminOnly,userDelete);


/**
 * @swagger
 * /api/user/deleteForAdmin/{id}:
 *   delete:
 *     summary: Delete a user Admin (superAdminOnly)
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.delete('/deleteForAdmin/:id',authMiddleware,superAdminOnly,userDeleteForAdmin);
/**
 * @swagger
 * /api/user/showAllAdmin:
 *   get:
 *     summary: Get all Admin =>(superAdmin)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 students:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 teachers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */

router.get('/showAllAdmin',authMiddleware,superAdminOnly,getAllAdmins);
module.exports = router;
