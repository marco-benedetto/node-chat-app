const path = require('path'); //No need to npm i, because it's a built-in module 
const express = require('express');
const socketIO = require('socket.io');
const http = require('http'); //built-in

const {generateMessage} = require('./utils/message');

//console.log(__dirname + '/../public'); //old way to do this

//Best way to this is using Path module
//We're using join method which takes two paths and cleans up the path

const publicPath = path.join(__dirname, '../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

//Set up for heroku deployment
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app! Have fun!'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined. Say hi!'));

    socket.on('disconnect', () => {
        console.log('User disconnected');
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

    socket.on('createMessage', (message) => {
        console.log('New message:', message);
        io.emit('newMessage', generateMessage(message.from, message.text)); //broadcasting a message. Socket.emit sends to a single open channel, io.emit sends to everyone connected
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // }); //this emit an event to everyone but the one who has the socket open
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});