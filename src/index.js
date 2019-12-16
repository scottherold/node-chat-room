// *** This module is the entry point to the application *** //

// *** MODULES *** //
// ** native Modules ** //
const path = require('path')
const http = require('http') // <-- needed to split websockets from traditional http requests

// ** npm Modules ** //
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');

// *** SERVER CREATION *** //
const app = express();
const server = http.createServer(app); // <-- split out from app
const port = process.env.PORT;

// *** WEBSOCKETING CREATION *** //
const io = socketio(server);

// *** EXPRESS CONFIG *** //
// ** Paths ** //
const publicDirectoryPath = path.join(__dirname, '../public');

// ** Settings ** //
app.use(express.static(publicDirectoryPath));

// *** SERVER ROUTING *** //
app.get('', (req, res) => {
    res.render('index.html');
});

// *** SOCKETING *** //
// on connect
io.on('connection', socket => {
    socket.emit('message', 'Welcome!'); // <-- welcome message

    /*
    / When a client connects, this is sent to all other connected clients
    / This follows the welcome message sent back to the connecting client via socket.emit
    */
    socket.broadcast.emit('message', 'A new user has joined!');

    // sendMessage received
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter(); // <-- profanity filter

        // runs profanity filter
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed'); // <-- sends data back to the server
        }
        
        io.emit('message', message);
        callback(); // <-- acknowledgement
    });

    // location received
    socket.on('sendLocation', (position, callback) => {
        socket.broadcast.emit('message', `https://google.com/maps?q=${position.latitude},${position.longitude}`); // <-- send location to all other connected clients
        callback('Location shared!')
    })

    /* 
    / On client disconnect (built-in event through socket.io)
    / must be called as a callback within an io.on() function
    */
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    });
});


// *** SERVER INSTANTIATION *** //
// the HTTP server now listens, leaving the express app open for websocketing
server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});