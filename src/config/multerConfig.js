// src/config/multerConfig.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'images') cb(null, 'public/images');
    else if (file.fieldname === 'attachments') cb(null, 'public/attachments');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

module.exports = upload;
