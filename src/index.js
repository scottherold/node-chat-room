// *** This module is the entry point to the application *** //

// *** MODULES *** //
// ** native Modules ** //
const path = require('path')
const http = require('http') // <-- needed to split websockets from traditional http requests

// ** npm Modules ** //
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');

// ** app modules ** //
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, getUser, getUsersInRoom, removeUser } = require('./utils/users')

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
    console.log('New WebSocket connection');

    /* 
    / user joins chatroom
    / refactored with user object to provide validated data, 'called options'
    */
    socket.on('join', (options, callback) => {
        /* 
        / add user to users array stored on the server
        / Uses object destructing (both in contruction and in variable generation)
        / -- populates user or error depending on result of function
        / refactored to use the 'spread operator' (...) with the provided object to populate the matching properties
        */
        const { error, user } = addUser({ id: socket.id, ...options })

        // invalid username error
        if (error) {
            return callback(error);
        }
        
        // User joins the chatroom
        socket.join(user.room);

        // Welcome message
        socket.emit('message', generateMessage('Welcome!'));

        /*
        / When a client connects, this is sent to all other connected clients
        / This follows the welcome message sent back to the connecting client via socket.emit
        */
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`));

        callback(); // <-- tells the client that the user was successfully able to join
    });

    // sendMessage received
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter(); // <-- profanity filter

        // runs profanity filter
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed'); // <-- sends data back to the server
        }
        
        io.to('Test').emit('message', generateMessage(message));
        callback(); // <-- acknowledgement
    });

    // location received
    socket.on('sendLocation', (position, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${position.latitude},${position.longitude}`)); // <-- send location to all other connected clients
        callback('Location shared!')
    });

    /* 
    / On client disconnect (built-in event through socket.io)
    / must be called as a callback within an io.on() function
    */
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        // refactored for room specific message
        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`));
        }
    });
});

// *** SERVER INSTANTIATION *** //
// the HTTP server now listens, leaving the express app open for websocketing
server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});