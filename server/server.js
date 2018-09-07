const path = require('path'); //No need to npm i, because it's a built-in module 
const express = require('express');
const socketIO = require('socket.io');
const http = require('http'); //built-in

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

//console.log(__dirname + '/../public'); //old way to do this

//Best way to this is using Path module
//We're using join method which takes two paths and cleans up the path

const publicPath = path.join(__dirname, '../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

//Set up for heroku deployment
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
        var user = users.removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
        }
    });

    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required');
        }

        socket.join(params.room);
        users.removeUser(socket.id); //remove the user from other rooms he/she has entered in
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUsersList', users.getUserList(params.room));

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app! Have fun!'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined. Say hi!`));
        callback();
    });

    // socket.emit('newEmail', {
    //     from: 'mike@test.com',
    //     text: 'Hey! How are you doing?',
    //     createdAt: 123
    // });

    // socket.on('createEmail', (newEmail) => {
    //     console.log('createEmail', newEmail);
    // });

    // socket.emit('newMessage', {
    //     from: "Marco",
    //     text: "Hi there!",
    //     createdAt: new Date().getTime()
    // });

    socket.on('createMessage', (message, callback) => {
        console.log('New message:', message);
        var user = users.getUser(socket.id);

        if(user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text)); //broadcasting a message. Socket.emit sends to a single open channel, io.emit sends to everyone connected
        }
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // }); //this emit an event to everyone but the one who has the socket open
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);

        if(user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});