const path = require('path')
const multer = require('multer')
const {
  UserAudio,
  Comment,
  Surah,
  User,
  Circle,
  CircleUser
} = require('../models')
const asyncHandler = require('express-async-handler')
const { where, Model } = require('sequelize')
const {
  ValidateCreateComment,
  ValidateCreateAudio
} = require('../validations/audioValidation')
const { date } = require('joi')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/audios/')
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname)
    cb(null, uniqueName)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /mp3|wav|m4a/
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowed.test(ext)) {
      cb(null, true)
    } else {
      cb(new Error('Only audio files (mp3, wav, m4a) are allowed'))
    }
  }
}).single('audio')

const uploadAudio = (req, res) => {
  upload(req, res, async err => {
    try {
      if (err) return res.status(400).json({ error: err.message })
      if (!req.file)
        return res.status(400).json({ error: 'Please upload an audio file' })

      console.log('BODY:', req.body)
      console.log('USER:', req.user)
      console.log('FILE:', req.file)

      const studentId = req.user?.id
      const surahId = Number(req.body.surah_id)
      const fromAyahId = Number(req.body.from_ayah_id)
      const toAyahId = Number(req.body.to_ayah_id)

      if (!studentId || !surahId || !fromAyahId || !toAyahId) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const userAudio = await UserAudio.create({
        student_id: studentId,
        surah_id: surahId,
        from_ayah_id: fromAyahId,
        to_ayah_id: toAyahId,
        file: `public/audios/${req.file.filename}`

      })

      const surah = await Surah.findOne({ where: { id: userAudio.surah_id } })
      return res.json({
        message: 'Audio uploaded and saved successfully',
        id: userAudio.id,
        surah_name: surah.name || null,
        from_ayah_id: userAudio.from_ayah_id,
        to_ayah_id: userAudio.to_ayah_id,
        filePath: userAudio.file,
        createAt: userAudio.created_at,
        updateAt: userAudio.updated_at
      })
    } catch (e) {
      console.error(' Error while saving:', e)
      return res.status(500).json({ error: e.message })
    }
  })
}

//get all audios for student
const getAllAudiosForStudent = asyncHandler(async (req, res) => {
  const studentId = req.user.id

  const audios = await UserAudio.findAll({
    where: { student_id: studentId }
  })

  if (audios.length === 0) {
    return res.status(200).json({ message: "You don't have any audio yet",date :[] })
  }

  return res.status(200).json({
    message: 'All audios retrieved successfully',
    audios
  })
})
/////////////////////get audio by id
const getAudioById = asyncHandler(async (req, res) => {
  const studentId = req.user.id
  const AudioId = req.params.id

  const audio = await UserAudio.findOne({
    where: { id: AudioId, student_id: studentId }
  })

  if (!audio) {
    return res.status(404).json({ error: 'Audio not found' })
  }

  const comment = await Comment.findAll({
    where: { audio_id: AudioId },
    attributes: ['id', 'text', 'rate', 'created_at', 'updated_at']
  })

  const surah = await Surah.findOne({
    where: { id: audio.surah_id }
  })

  return res.json({
    message: 'Audio retrieved successfully',
    audio: {
      id: audio.id,
      filePath: audio.file,
      from_ayah_id: audio.from_ayah_id,
      to_ayah_id: audio.to_ayah_id,
      surah_name: surah?.name || null
    },
    comment: comment || 'not have comment yet'
  })
})

/////////////////delete
const deleteAudio = asyncHandler(async (req, res) => {
  const studentId = req.user.id
  const audioId = req.params.id

  // Find audio that belongs to the logged-in student
  const audio = await UserAudio.findOne({
    where: { id: audioId, student_id: studentId }
  })

  if (!audio) {
    return res.status(404).json({ message: 'Audio not found' })
  }

  await audio.destroy()

  return res.status(200).json({
    message: 'Audio deleted successfully'
  })
})
///////create comment
const createComment = asyncHandler(async (req, res) => {
  const { error } = ValidateCreateComment(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  const teacherId = req.user.id
  const audioId = req.params.id
  const audio = await UserAudio.findOne({
    where: { id: audioId }
  })
  const user = await User.findOne({ where: { id: teacherId } })
  if (!audio) {
    return res.status(404).json({
      message: 'Audio not found'
    })
  }

  const comment = await Comment.create({
    teacher_id: teacherId,
    audio_id: audio.id,
    text: req.body.textComment,
    rate: req.body.rate
  })

  return res.status(200).json({
    message: 'Comment created successfully',
    data: {
      commentId: comment.id,
      audioFile: audio.file,
      notesTeacher: comment.text,
      rate: audio.rate,
      studentId: user.id,
      studentFirstName: user.first_name,
      studentLastName: user.last_name
    }
  })
})
////////get all audios for teacher
const getAllAudiosForTeacher = asyncHandler(async (req, res) => {
  const teacherId = req.user.id

  const user = await User.findOne({
    where: { id: teacherId, is_save_quran: true }
  })

  let audios = []

  if (user) {
    audios = await UserAudio.findAll()
  } else {
    const userCircles = await CircleUser.findAll({
      where: { user_id: teacherId },
      include: [
        {
          model: Circle,
          as: 'circle_users',
          where: { circle_type_id: 1 },
          attributes: ['id', 'name']
        }
      ]
    })

    if (!userCircles.length) {
      return res
        .json({ message: 'No circles found for this teacher' })
    }

    const circleIds = userCircles.map(entry => entry.circle_id)

    const studentCircles = await CircleUser.findAll({
      where: { circle_id: circleIds, role: 1 },
      attributes: ['user_id']
    })

    const studentIds = studentCircles.map(entry => entry.user_id)

    if (!studentIds.length) {
      return res
        .json({ message: "No students found in teacher's circles" ,date :[]})
    }

    audios = await UserAudio.findAll({
      where: { student_id: studentIds }
    })
  }

  const audioIds = audios.map(a => a.id)
  const comments = await Comment.findAll({
    where: { audio_id: audioIds },
    attributes: ['audio_id']
  })
  const commentedAudioIds = comments.map(c => c.audio_id)

  const AudiosWithoutComments = audios.filter(
    audio => !commentedAudioIds.includes(audio.id)
  )

  return res.status(200).json({
    message: 'All audios without comments',
    Audios: AudiosWithoutComments
  })
})


module.exports = {
  uploadAudio,
  getAllAudiosForStudent,
  getAudioById,
  deleteAudio,
  createComment,
  getAllAudiosForTeacher
}
