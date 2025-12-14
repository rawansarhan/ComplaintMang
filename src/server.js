require('dotenv').config()

const http = require('http')
const app = require('./app')
const sequelize = require('./config/database')
const { initSocket } = require('./socket/socket')

const PORT = process.env.PORT || 3000

sequelize.authenticate()
  .then(() => {
    console.log('Database connected')

    // 👇 إنشاء HTTP server
    const server = http.createServer(app)

    // 👇 تهيئة Socket.io
    initSocket(server)

    // 👇 تشغيل السيرفر
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })
