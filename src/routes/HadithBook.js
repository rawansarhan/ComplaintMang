const express = require('express');
const router = express.Router();
const {
  createBook,
  getAllBooks,
  deleteBook,
  updateBook
}= require('../controllers/BookHadithController');

const { authMiddleware, adminOnly ,authorizeRoles, teacherOnly} = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/hadith-book/create:
 *   post:
 *     summary: Create a new Hadith book (admin only)
 *     tags: [HadithBook]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - hadith_num
 *             properties:
 *               name:
 *                 type: string
 *               hadith_num:
 *                 type: integer
 *           example:
 *             name: صحيح البخاري
 *             hadith_num: 500
 *     responses:
 *       200:
 *         description: Hadith book created successfully.
 *       400:
 *         description: Validation error.
 *       500:
 *         description: Internal server error.
 */
router.post('/create', authMiddleware, adminOnly, createBook);

/**
 * @swagger
 * /api/hadith-book/getAllBook:
 *   get:
 *     summary: Get all Hadith books (admin only,teacher only)
 *     tags: [HadithBook]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hadith books retrieved successfully.
 *       404:
 *         description: No Hadith books found.
 *       500:
 *         description: Internal server error.
 */
router.get(
  '/getAllBook',
  authMiddleware,
  authorizeRoles('admin', 'teacher'),  
  getAllBooks
);


/**
 * @swagger
 * /api/hadith-book/update/{id}:
 *   put:
 *     summary: Update a Hadith book by ID (admin only)
 *     tags: [HadithBook]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Hadith book to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               hadith_num:
 *                 type: integer
 *           example:
 *             name: سنن الترمذي
 *             hadith_num: 400
 *     responses:
 *       200:
 *         description: Hadith book updated successfully.
 *       400:
 *         description: Validation error.
 *       404:
 *         description: Book not found.
 *       500:
 *         description: Internal server error.
 */
router.put('/update/:id', authMiddleware, adminOnly, updateBook);

/**
 * @swagger
 * /api/hadith-book/delete/{id}:
 *   delete:
 *     summary: Delete a Hadith book by ID (admin only)
 *     tags: [HadithBook]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Hadith book to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book deleted successfully.
 *       404:
 *         description: Book not found.
 *       500:
 *         description: Internal server error.
 */
router.delete('/delete/:id', authMiddleware,adminOnly , deleteBook);

module.exports = router;
