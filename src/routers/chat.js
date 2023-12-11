const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');



router.post('/sendMessage', chatController.sendMessage)
router.post('/createRoomChat', chatController.createRoom)
router.get('/getRoomsChat', chatController.getRoomsChat)

module.exports = router;