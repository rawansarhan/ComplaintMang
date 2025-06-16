const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());


// 📘 إضافة Swagger
const setupSwagger = require('./swagger'); // تأكد من مسار الملف
setupSwagger(app); // تفعيل Swagger UI على /api-docs

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const mosqueRoutes = require('./routes/Mosque');
app.use('/api/mosque', mosqueRoutes);


// 👇 مهم جدًا!
module.exports = app;
