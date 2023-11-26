let io;

module.exports = {
    initIO: (server, option) => {
        io = require('socket.io')(server, option)
    },
    getIO: () => {
        if (io) {
            return io;
        }
    }
}