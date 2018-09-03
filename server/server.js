const path = require('path'); //No need to npm i, because it's a built-in module 
const express = require('express');
const socketIO = require('socket.io');
const http = require('http'); //built-in

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

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});