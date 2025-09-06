const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

app.use('/public', express.static('public'));
// إضافة Swagger
const setupSwagger = require('./swagger'); 
setupSwagger(app); 
app.use(express.static('public'));
const path = require("path");
app.use("/audios", express.static(path.join(__dirname, "public/audios")));
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
const hadithRecitation = require('./routes/HadithRecitation');
app.use('/api/hadith-recitation', hadithRecitation); 
const QuranTalkeen = require('./routes/TalkeenRecitation');
app.use('/api/talkeen-recitation', QuranTalkeen);
const surah = require('./routes/surahAndAyah');
app.use('/api/SurahAndAyah', surah); 
const exam = require('./routes/Exam');
app.use('/api/exam', exam);  
const LessonSession = require('./routes/lesson');
app.use('/api/LessonSession', LessonSession);  
const UserAudio = require('./routes/audio');
app.use('/api/UserAudio', UserAudio);  
const Statistics = require('./routes/statistics');
app.use('/api/Statistics', Statistics);  


module.exports = app;
