// *** Client-side JS *** //

// *** VARIABLES *** //
const messageForm = document.querySelector('#message-form'); // <-- form with message
// const messageInput = document.querySelector('input'); // <-- form data

// *** WEBSOCKETING *** //
// ** Connection ** //
const socket = io();

// ** Socket Listening ** //
// Receive message from server
socket.on('message', message => {
    console.log(message);
});

// ** Event Listening ** //
// form submit
messageForm.addEventListener('submit', e => {
    e.preventDefault(); // <-- prevent page refresh

    /*
    / e === element. This allows you to target the DOM element by event
    / in this case e.target === the form.
    / with that form object, you can access the properties by name (in this case 'message')
    */
    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message); // <-- emit data to server
    e.target.reset(); //<-- Reset form
});