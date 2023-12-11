const RoomChat = require('../models/RoomChat');
const io = require('../utils/socket');

exports.sendMessage = async (req, res) => {
    try {
        const { message, roomId, isClient } = req.body;
        const messageInfo = {
            message: message,
            isClient: isClient,
            date: new Date(),
        }
        io.getIO().emit(roomId, messageInfo)
        return res.json({
            messageInfo: messageInfo,
            roomId: roomId
        })
    } catch (error) {
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

exports.createRoom = async (req, res) => {
    try {
        const { userId } = req.body;
        const roomChat = new RoomChat({
            message: [],
            user: userId,
        });
        // io.getIO().emit('newRooms', roomChatCreated);
        const roomChatCreated = await roomChat.save();
        return res.json(roomChatCreated);
    } catch (error) {
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false,
        }));
    }
}

exports.getRoomsChat = async (req, res) => {
    try {
        const rooms = await RoomChat.find();
        return res.json(rooms);
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false,
        }));
    }
}

