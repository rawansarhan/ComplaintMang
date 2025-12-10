require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/attachments', express.static(path.join(__dirname, '../public/attachments')));

app.use(cors());
app.options('*', cors());
app.use(express.json());
// app.use('/public', express.static(path.join(__dirname, 'public')));

// Swagger
const { setupSwagger } = require('./swagger');
setupSwagger(app);

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const complaintRoutes = require('./routes/complaint');
app.use('/api/complaint', complaintRoutes);

module.exports = app; // صدّر التطبيق مباشرة
