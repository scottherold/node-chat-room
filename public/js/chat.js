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
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// ** options ** //

/*
/ Qs library parses the location.search string provided by the browser through HTML5
/ the option 'ignoreQueryPrefix' removes the question mark at the start of the query string
/ Relevant object properties destructured from parsed string
*/
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

/* 
/ Autoscrolling function
/ This function will allow autoscroll if the user is scrolled to the bottom of the browser window
/ If the user scrolls up, the function will not automatically scroll down
/ If the user returns to the bottom of the scrollable window, they will again be autoscrolled upon receivign a new message
*/
const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild; // <-- grabs last child element of chained parent element

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage); // <-- grabs active CSS for element
    const newMessageMargin = parseInt(newMessageStyles.marginBottom); // <-- grabs margin-bottom style attribute for the element provided
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin; // <-- grabs the actual height of the element, including styles

    // Visible height
    const visibleHeight = $messages.offsetHeight; // <-- the height of messages (messages element) within the chat area (chat__main element)

    // Height of the messages container
    const containerHeight = $messages.scrollHeight; // <-- total height of which the area that we can scroll through (messages element)

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight; // <-- provides as a number, the amount of distance that has been scrolled from the top

    /*
    / Scrolling logic
    / Takes the containerHeight and subtracts the newMessage (most recent message) height value and compares that to the scrollOffset
    / If the number is less than or equal to the scrollOffset variable (bigger than screen), then autoscroll
    */
    if (containerHeight - newMessageHeight <= scrollOffset) {
        /*
        / increases the scrollTop value, which scrolls the page to the bottom automatically
        / also adds that number to the scrollOffset equation
        */
        $messages.scrollTop = $messages.scrollHeight;
    }
};

// ** Socket Listening ** //
// Standard Message Rendering
socket.on('message', message => {
    /* 
    / Grabs HTML from the template; injects server data into HTMLf
    / refactored to handle objects sent from server
    / uses moment library to format the createdAt time
    */
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html); // <-- inserts the html above as the last html element before this div ends
    autoscroll(); // <-- Runs autoscroll logic after each new message
});

// Location Message Rendering
socket.on('locationMessage', locationMessage => {
    // Grabs HTML from the template; injects server data into HTML
    const html = Mustache.render(locationTemplate, {
        username: locationMessage.username,
        url: locationMessage.url,
        createdAt: moment(locationMessage.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html); // <-- inserts the html above as the last html element before this div ends
    autoscroll(); // <-- Runs autoscroll logic after each new message
});

// send join information to server (username, and room)
socket.emit('join', { username, room }, error => {
    if (error) {
        alert(error);
        location.href = '/'; // <-- browser location used to send user to the root URL
    }
});

// Receive updated user list from room
socket.on('roomData', ({ room, users }) => {
    // Grabs HTML from the template; injects server data into HTML
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    });
    document.querySelector("#sidebar").innerHTML = html; // <-- regenerates HTML on each update from server
});

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
