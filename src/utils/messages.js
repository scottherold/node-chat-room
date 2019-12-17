// *** This utility generates the message objects to be sent to the client *** //

// *** FUNCTIONS *** //
// standard message
const generateMessage = text => {
    return {
        text,
        createdAt: new Date().getTime()
    };
};

// location message
const generateLocationMessage = url => {
    return {
        url,
        createdAt: new Date().getTime()
    };
};

// *** EXPORTS *** //
module.exports = {
    generateMessage,
    generateLocationMessage
};