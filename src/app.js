const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());


// إضافة Swagger
const setupSwagger = require('./swagger'); 
setupSwagger(app); 

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const mosqueRoutes = require('./routes/Mosque');
app.use('/api/mosque', mosqueRoutes);
const circleRoutes = require('./routes/circle')
app.use('/api/circle',circleRoutes);
const userRouter = require('./routes/user')
app.use('/api/user',userRouter)
const challengeRouter = require('./routes/challange');
app.use('/api/challenge', challengeRouter); 
const quranRecitition = require('./routes/QuranRecitation');
app.use('/api/quran-recitation', quranRecitition); 
const circleType = require('./routes/circlesTypes');
app.use('/api/circle-type', circleType); 
const session = require('./routes/sesssion');
app.use('/api/session', session); 
const hadithBook = require('./routes/HadithBook');
app.use('/api/hadith-book', hadithBook); 

module.exports = app;
