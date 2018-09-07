var socket = io(); //making a request for a websocket

function scrollToBottom() {
    //Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child'); //selects the last child of li element
    //Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight')
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight(); //.prev() returns the previous element in newMessage

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function () {
    console.log('Connected to server');
    var params = jQuery.deparam(window.location.search);
    
    socket.emit('join', params, function (err) {
        if(err) {
            alert(err);
            window.location.href = '/'; //it redirects back to the home page
        } else {
            console.log('No error');
        }
    });
});

socket.on('updateUsersList', function (users) {
    console.log('Users list', users);
    var ol = jQuery('<ol></ol>');

    users.forEach(function (user) {
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

// socket.on('newEmail', function (email) {
//     console.log('New email', email);
// });

// socket.emit('createEmail', {
//     to: "jen@test.com",
//     text: "Hi there!"
// });

socket.on('newMessage', function(message) {
    console.log('Got new message!', message);
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);

    // jQuery('#messages').append(li);
});

// socket.emit('createMessage', {
//     from: "test@test.com",
//     text: "What's up dude?"
// });

// socket.emit('createMessage', {
//     from: 'Frank',
//     text: 'Hi!'
// }, function (data) {
//     console.log('Got it!', data);
// });

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault(); //prevent default behaviour of refreshing page

    var messageTextBox = jQuery('[name=message]');

    socket.emit('createMessage', {
        text: messageTextBox.val()
    }, function () {
        messageTextBox.val(''); //setting input text to empty string
    });
});

socket.on('newLocationMessage', function (message) {

    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
    // var li = jQuery('<li></li>');
    // var a = jQuery('<a target="_blank">My current location</a>');
    // 

    // li.text(`${message.from} ${formattedTime}: `);
    // a.attr('href', message.url);
    // li.append(a);
    // jQuery('#messages').append(li);
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function() {
    if (!navigator.geolocation) {
        return alert('geolocation not supported by your browser');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send location');
        console.log(position);
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function() {
        alert('Unable to fetch location');
        locationButton.removeAttr('disabled').text('Send location');
    });
});