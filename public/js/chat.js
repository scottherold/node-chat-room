// *** Client-side JS *** //

// *** WEBSOCKETING *** //
// ** Connection ** //
const socket = io();

// ** Socket Listening ** //
socket.on('countUpdated', count => {
    console.log('The count has been updated', count);
});

// ** Event Listening ** //
document.querySelector('#increment').addEventListener('click', () => {
    socket.emit('increment');
    console.log('Clicked');
});