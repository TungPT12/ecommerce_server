const express = require('express');
const orderController = require('../../controllers/client/order');
const { verifyUserToken } = require('../../verifyToken/verifyUserToken');
const router = express.Router();

router.post('/checkout', verifyUserToken, orderController.createOrder)

module.exports = router