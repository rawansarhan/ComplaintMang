const asyncHandler = require('express-async-handler');
const { User, Role, Mosque, Circle, CircleUser, CircleType, HadithBook } = require('../models');
const { HadithBookValidation_create, HadithBookValidation_update } = require('../validations/HadithBookValidation');
const { date } = require('joi');

//create new book
const createBook = asyncHandler(async (req, res) => {
  try {
    const { error } = HadithBookValidation_create(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const mosque_id = req.user.mosque_id;

    const book = await HadithBook.create({
      mosque_id,
      name: req.body.name,
      hadith_num: req.body.hadith_num
    });

    return res.status(201).json({
      message: "Hadith book created successfully.",
      data: book
    });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ message: 'Internal server error', details: err.message });
  }
});

//get all book
const getAllBooks = asyncHandler(async (req, res) => {
  try {
    const mosqueId = req.user.mosque_id;

    const books = await HadithBook.findAll({
      where: { mosque_id  :mosqueId},
    });

    if (books.length === 0) {
      return res.status(200).json({ message: 'No Hadith books found.' ,date :[]});
    }

    return res.status(200).json({
      message: 'Hadith books retrieved successfully.',
      data: books
    });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ message: 'Internal server error', details: err.message });
  }
});

// delete book
const deleteBook = asyncHandler(async (req, res) => {
  try {
    const book = await HadithBook.findOne({ where: { id: req.params.id } });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await book.destroy();

    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ message: 'Internal server error', details: err.message });
  }
});

// update book
const updateBook = asyncHandler(async (req, res) => {
  try {
    const { error } = HadithBookValidation_update(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const book = await HadithBook.findOne({ where: { id: req.params.id } });

    if (!book) return res.status(404).json({ message: "Book not found" });

    book.name = req.body.name || book.name;
    book.hadith_num = req.body.hadith_num || book.hadith_num;

    await book.save();

    return res.status(200).json({
      message: "Hadith book updated successfully.",
      data: book
    });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ message: 'Internal server error', details: err.message });
  }
});

module.exports = {
  createBook,
  getAllBooks,
  deleteBook,
  updateBook
};
