const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');



router.post('/sendMessage', chatController.sendMessage)
router.post('/createRoomChat', chatController.createRoom)
router.get('/getRoomsChat', chatController.getRoomsChat)
router.get('/room/:id', chatController.getRoomChat)
router.post('/room-chat-user', chatController.getRoomChatByUserId)
router.delete('/room-chat/:id', chatController.destroyRoomChat)

module.exports = router;