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
const circleRoutes = require('./routes/circle')
app.use('/api/circle',circleRoutes);
const userRouter = require('./routes/user')
app.use('/api/user',userRouter)
// 👇 مهم جدًا!
module.exports = app;
