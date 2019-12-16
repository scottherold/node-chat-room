// *** Client-side JS *** //

// *** WEBSOCKETING *** //
// ** Connection ** //
const socket = io();

// ** Socket Listening ** //
// Receive message from server
socket.on('message', message => {
    console.log(message);
});

// *** Event Listening *** //
// form submit
document.querySelector('#message-form').addEventListener('submit', e => {
    e.preventDefault(); // <-- prevent page refresh

    /*
    / e === element. This allows you to target the DOM element by event
    / in this case e.target === the form.
    / with that form object, you can access the properties by name (in this case 'message')
    */
    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message, error => {
        // error === profanity detected in message
        if (error) {
            return console.log(error);
        }

        console.log('Message delivered');
    });
    e.target.reset(); //<-- Reset form
});

// Send location
document.querySelector('#send-location').addEventListener('click', () => {
    
    // This will check to see if the client's browser is compatible with geolocation services
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.');
    }

    // geolocation is asynchronous, but does not support the promise API, so a callback function is necessary
    navigator.geolocation.getCurrentPosition(position => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, message => {
            console.log(message);
        });
    });
});
