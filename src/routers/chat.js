const multer = require('multer');
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');



router.post('/sendMessage', chatController.sendMessage)

module.exports = router;