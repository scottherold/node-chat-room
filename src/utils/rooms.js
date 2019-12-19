// *** This utility will track the unique rooms with active users *** //
// *** VARIABLES *** //
const rooms = [];

const addRoom = userRoom => {
    // check for existing room
    const existingRoom = rooms.find(room => {
        return room.name === userRoom; // <-- returns true if match detected
    });

    if(existingRoom) {
        return rooms;
    }

    // If not room exists, add room
    rooms.push({
        name: userRoom
    });

    return rooms;
};

const removeRoom = userRoom => {
     /* 
     / similar to find, but returns the index of the value found
     / Shorthand syntax
     */
    const index = rooms.findIndex(room => room.name === userRoom); // <-- will return -1 if no match, otherwise will return index within array
    
    if (index !== -1) {
        rooms.splice(index, 1)[0]; // <-- removes one item at the index; returns an array
        return rooms;
    }
};

const getRooms = () => {
    return rooms;
};

// *** EXPORTS *** //
module.exports = {
    addRoom,
    removeRoom,
    getRooms
};