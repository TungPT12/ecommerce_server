const express = require('express');
const orderController = require('../../controllers/client/order');
const { verifyUserToken } = require('../../verifyToken/verifyUserToken');
const router = express.Router();

router.get('/checkout', verifyUserToken, orderController.createOrder)

module.exports = router