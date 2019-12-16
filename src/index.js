// *** This module is the entry point to the application *** //

// *** MODULES *** //
// ** native Modules ** //
const path = require('path')
const http = require('http') // <-- needed to split websockets from traditional http requests

// ** npm Modules ** //
const express = require('express');
const socketio = require('socket.io');

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
    socket.on('sendMessage', message => {
        io.emit('message', message);
    });

    /* 
    / On client disconnect (built-in event through socket.io)
    / must be called as a callback within an io.on() function
    */
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    });
});

// on disconnect


// *** SERVER INSTANTIATION *** //
// the HTTP server now listens, leaving the express app open for websocketing
server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});