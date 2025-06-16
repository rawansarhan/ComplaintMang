const asyncHandler = require('express-async-handler')
const { 
  ValidateMosqueCraete,
  ValidateMosqueUpdate
} = require('../validations/mosqueValidation')
const { Mosque } = require('../models')
const bcrypt = require('bcryptjs')

const mosqueCreate = asyncHandler(async (req, res) => {
  try {
    const { error } =ValidateMosqueCraete(req.body)

    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      })
    }

    // Check if a mosque with the same name and address already exists
    const existingMosque = await Mosque.findOne({
      where: {
        name: req.body.name,
        address: req.body.address
      }
    })

    if (existingMosque) {
      return res.status(409).json({
        message: 'A mosque with the same name and address already exists.'
      })
    }

    const code = await generateUniqueCode()
    const salt = await bcrypt.genSalt(10)
    const hashedCode = await bcrypt.hash(code, salt)
    const mosques = await Mosque.create({
      name: req.body.name,
      address: req.body.address,
      code: hashedCode
    })

    return res.status(200).json({
      mosques,
      message: 'Mosque created successfully'
    })
  } catch (err) {
    console.error('Database error:', err) // أضف هذا
    return res
      .status(500)
      .json({ message: 'Database error', details: err.message })
  }
})

async function generateUniqueCode () {
  let code
  let exists = true

  while (exists) {
    code = Math.floor(100000 + Math.random() * 900000)
    console.log(code)
    const mosqueWithCode = await Mosque.findOne({ where: { code: code } })
    exists = !!mosqueWithCode
  }

  return code
}

//////////////////show All mosque

const mosqueAllShow = asyncHandler(async (req, res) => {
  try {
    const mosques = await Mosque.findAll({
      attributes: { exclude: ['code'] } // ← استثناء حقل code
    })

    return res.status(200).json(mosques)
  } catch (err) {
    console.error('Database error:', err)
    return res
      .status(500)
      .json({ message: 'Database error', details: err.message })
  }
})
//////////show mosque by id
const mosqueShowById = asyncHandler(async (req, res) => {
  try {
    const mosqueId = req.params.id

    const mosque = await Mosque.findOne({
      where: { id: mosqueId },
      attributes: ['id', 'name', 'address', 'code', 'created_at', 'updated_at'] 
    })

    if (!mosque) {
      return res.status(404).json({ message: 'Mosque not found' })
    }

    return res.status(200).json(mosque)
  } catch (err) {
    console.error('Database error:', err)
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    })
  }
})
/////update mosque
const mosqueUpdate = asyncHandler(async (req, res) => {
  try {
    const { error } = ValidateMosqueCraete(req.body)
    const mosqueId = req.params.id

    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      })
    }

    const mosque = await Mosque.findOne({ where: { id: mosqueId } })
    if (!mosque) {
      return res.status(404).json({ message: 'Mosque not found' })
    }

    mosque.name = req.body.name || mosque.name
    mosque.address = req.body.address || mosque.address

    await mosque.save()

    return res.status(200).json({
      message: 'Mosque updated successfully',
      mosque
    })
  } catch (err) {
    console.error('Database error:', err)
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    })
  }
})

///////delete:
const mosqueDelete = asyncHandler(async (req, res) => {
  try {
    const mosqueId = req.params.id

    const mosque = await Mosque.findOne({ where: { id: mosqueId } })
    if (!mosque) {
      return res.status(404).json({ message: 'Mosque not found' })
    }

    await mosque.destroy() 
    return res.status(200).json({
      message: 'Mosque deleted successfully',
      mosque
    })
  } catch (err) {
    console.error('Database error:', err)
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    })
  }
})

module.exports = {
mosqueCreate,
mosqueAllShow,
mosqueShowById,
mosqueUpdate,
mosqueDelete

}
