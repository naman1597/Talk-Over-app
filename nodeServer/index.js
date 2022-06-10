//Node server which will handle socket  io connections
const io = require('socket.io')(8000,{
    cors:{
        origin: "*"
    }
})

const users = {};

io.on('connection',socket =>{
    //If any new user joins, let other users which are connected to server know!!! 
    socket.on('new-user-joined', names =>{
        users[socket.id] = names;
        socket.broadcast.emit('user-joined', names);
    });

    //If someone sends a message, broadcast it to other people
    socket.on('send', message =>{
        socket.broadcast.emit('recieve', {message: message, names: users[socket.id]})
    });

    //If someone leaves the chat, let others know
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})