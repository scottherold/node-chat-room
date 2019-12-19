// *** Client-side JS *** //

// *** WEBSOCKETING *** //
// ** Connection ** //
const socket = io();

// *** VARIABLES *** //
// ** elements ** //
const $loginForm = document.querySelector('#login-form');

// ** templates ** //
const loginFormTemplate = document.querySelector('#login-form-template').innerHTML;

// sends active room list
socket.on('activeRooms', rooms => {
    // Grabs HTML from the template; injects server data into HTML
    const html = Mustache.render(loginFormTemplate, { rooms });
    $loginForm.innerHTML = html; // <-- regenerates HTML on each update from server
});