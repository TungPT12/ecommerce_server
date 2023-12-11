const io = require('../utils/socket');

exports.sendMessage = async (req, res) => {
    try {
        const { message, roomId, userId } = req.body;
        io.getIO().emit(roomId, message)
        return res.json({
            message: message,
            roomId: roomId
        })
    } catch (error) {
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}