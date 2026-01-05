require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');

app.use(cors());
app.options('*', cors());
app.use(express.json());

// ✅ static FIRST
app.use('/public/images', express.static(path.join(__dirname, '../public/images')));
app.use('/public/attachments', express.static(path.join(__dirname, '../public/attachments')));

// Swagger
const { setupSwagger } = require('./swagger');
setupSwagger(app);

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const complaintRoutes = require('./routes/complaint');
app.use('/api/complaint', complaintRoutes);

// ✅ error handler LAST
app.use(errorHandler);

module.exports = app;
