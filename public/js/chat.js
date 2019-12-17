// *** Client-side JS *** //

// *** WEBSOCKETING *** //
// ** Connection ** //
const socket = io();

// *** VARIABLES *** //
// ** elements ** //
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

// ** templates ** //
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-message-template').innerHTML;

// ** options ** //

/*
/ Qs library parses the location.search string provided by the browser through HTML5
/ the option 'ignoreQueryPrefix' removes the question mark at the start of the query string
/ Relevant object properties destructured from parsed string
*/
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

// ** Socket Listening ** //
// Receive message from server
socket.on('message', message => {
    /* 
    / Grabs HTML from the template; injects server data into HTMLf
    / refactored to handle objects sent from server
    / uses moment library to format the createdAt time
    */
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html); // <-- inserts the html above as the last html element before this div ends
});

// Receive location URL from server
socket.on('locationMessage', locationMessage => {
    // Grabs HTML from the template; injects server data into HTML
    const html = Mustache.render(locationTemplate, {
        url: locationMessage.url,
        createdAt: moment(locationMessage.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html); // <-- inserts the html above as the last html element before this div ends
});

// send join information to server (username, and room)
socket.emit('join', { username, room })

// *** Event Listening *** //
// form submit
$messageForm.addEventListener('submit', e => {
    e.preventDefault(); // <-- prevent page refresh
    const message = e.target.elements.message.value

    // If message is blank, don't send to server
    if(message === '') {
        return;
    }
    
    $messageFormButton.setAttribute('disabled', 'disabled'); // <-- disable the form during transaction

    /*
    / e === element. This allows you to target the DOM element by event
    / in this case e.target === the form.
    / with that form object, you can access the properties by name (in this case 'message')
    */
    socket.emit('sendMessage', message, error => {
        $messageFormButton.removeAttribute('disabled'); // <-- enable the form after the transaction
        $messageFormInput.value = ''; // <-- reset form
        $messageFormInput.focus(); // <-- return cursor to input field

        // error === profanity detected in message
        if (error) {
            return console.log(error);
        }

        console.log('Message delivered');
    });
});

// Send location
$sendLocationButton.addEventListener('click', () => {
    // This will check to see if the client's browser is compatible with geolocation services
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.');
    }

    $sendLocationButton.setAttribute('disabled', 'disabled'); // <-- disable the form during transaction

    // geolocation is asynchronous, but does not support the promise API, so a callback function is necessary
    navigator.geolocation.getCurrentPosition(position => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, message => {
            $sendLocationButton.removeAttribute('disabled'); // <-- enable the form after the transaction
            console.log(message);
        });
    });
});
