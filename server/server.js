const path = require('path'); //No need to npm i, because it's a built-in module 
const express = require('express');

//console.log(__dirname + '/../public'); //old way to do this

//Best way to this is using Path module
//We're using join method which takes two paths and cleans up the path

const publicPath = path.join(__dirname, '../public');
var app = express();

//Set up for heroku deployment
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})