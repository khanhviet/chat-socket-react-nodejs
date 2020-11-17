const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const PORT = process.env.PORT || 5000

const router = require('./router')

const { addUser, removeUser, getUser, getUserInRoom } = require('./users')
const app = express()
const server = http.createServer(app)
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});
io.on('connection', socket => {
    console.log('has connection')

    socket.on('viet', ({ name, room }, callback) => {
        console.log(name, '+', room);
        const { error, user } = addUser({ id: socket.id, name, room })
        console.log(user, '===>')
        if (error) {
            callback({ error: 'error' })
        }
        socket.emit('message', { user: 'admin', text: `${user.name} welcome to the room ${user.room}` })
        socket.broadcast.to(user.room).emit('message', { user: 'admin', test: `${user.name} has join` })
        socket.join(user.room)
        callback()
    })
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('message', { user: user.name, text: message })
        callback();
    })

    socket.on('disconnect', () => {
        console.log('user had left')
    })
    // EMIT .ON SERVER CLIENT
})
app.use(router);
server.listen(PORT, () => {
    console.log(`server has started on port ${PORT}`)
})