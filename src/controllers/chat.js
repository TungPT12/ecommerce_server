const RoomChat = require('../models/RoomChat');
const io = require('../utils/socket');

exports.sendMessage = async (req, res) => {
    try {
        const { message, roomId, isClient } = req.body;
        const messageInfo = {
            message: message,
            isClient: isClient,
            time: new Date(),
        }

        const roomChat = await RoomChat.findById(roomId);
        roomChat.messages.push(messageInfo);
        const roomChatSave = await roomChat.save();
        if (roomChatSave) {
            io.getIO().emit(roomId, messageInfo)
            return res.json({
                messageInfo: messageInfo,
                roomId: roomId
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send(JSON.stringify({
            message: error.message,
            success: false
        }))
    }
}

exports.createRoom = async (req, res) => {
    try {
        const { userId } = req.body;
        const room = await RoomChat.findOne({
            user: userId
        })
        if (room) {
            return res.json(room);
        }
        const roomChat = new RoomChat({
            message: [],
            user: userId,
        });
        const roomChatCreated = await roomChat.save();
        io.getIO().emit('newRooms', roomChatCreated);
        return res.json(roomChatCreated);
    } catch (error) {
        console.log(error)

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


exports.getRoomChat = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await RoomChat.findOne({
            _id: id
        });
        return res.json(room);
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false,
        }));
    }
}

exports.getRoomChatByUserId = async (req, res) => {
    try {
        const { userId, roomId } = req.body;
        const room = await RoomChat.findOne({
            _id: roomId,
            user: userId
        });
        return res.json(room);
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false,
        }));
    }
}

exports.destroyRoomChat = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await RoomChat.findById(id);
        if (room) {
            const roomDeleted = await RoomChat.deleteOne({ _id: id })
            if (roomDeleted.deletedCount > 0) {
                io.getIO().emit('deleteRoomChat', id)
                return res.sendStatus(200);
            }
        }
        return res.status(400).send(JSON.stringify({
            message: "Cannot delete room",
            success: false
        }))
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false,
        }));
    }
}
