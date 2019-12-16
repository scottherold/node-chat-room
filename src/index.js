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
io.on('connection', () => {
    console.log('New WebSocket connection');
});

// *** SERVER INSTANTIATION *** //
// the HTTP server now listens, leaving the express app open for websocketing
server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});