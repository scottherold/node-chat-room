// *** This utility generates the message objects to be sent to the client *** //

// *** FUNCTIONS *** //
// standard message
const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    };
};

// location message
const generateLocationMessage = (username, url)  => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    };
};

// *** EXPORTS *** //
module.exports = {
    generateMessage,
    generateLocationMessage
};