// *** This utility will track the users in a given chatroom *** //

// *** VARIABLES *** //
const users = [];

// *** FUNCTIONS *** //
const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // validate the data
    if(!username || !room) {
        return {
            error: 'Username and room are required!'
        };
    }

    // Check for existing user
    const existingUser = users.find(user => {
        return user.room === room && user.username === username; // <-- returns a match as true if there is a current username taken in the room being accessed
    });

    // validate username
    if(existingUser) {
        return {
            error: 'Username is in use!'
        };
    }

    // store user
    const user = { id, username, room };
    users.push(user);
    return { user };
};

const getUser = id => {
     return users.find(user => user.id === id); // <-- shorthand syntax
};

const getUsersInRoom = room => {
    // validate the data
    room = room.trim().toLowerCase();
    return users.filter(user => user.room === room); // <-- shorthand syntax
};

const removeUser = id => {
     /* 
     / similar to find, but returns the index of the value found
     / Shorthand syntax
     */
    const index = users.findIndex(user => user.id === id); // <-- will return -1 if no match, otherwise will return index within array
    
    if (index !== -1) {
        return users.splice(index, 1)[0]; // <-- removes one item at the index; returns an array
    }
};

// *** MODULES EXPORTS *** //
module.exports = {
    addUser,
    getUser,
    getUsersInRoom,
    removeUser
};