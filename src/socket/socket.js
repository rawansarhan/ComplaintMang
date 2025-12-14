const { Server } = require('socket.io')

let io

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*'
    }
  })

  io.on('connection', socket => {
    console.log('User connected:', socket.id)

    socket.on('join', userId => {
      socket.join(`user_${userId}`)
    })

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
  })
}

function emitToUser(userId, event, data) {
  if (!io) return
  io.to(`user_${userId}`).emit(event, data)
}

module.exports = {
  initSocket,
  emitToUser
}
