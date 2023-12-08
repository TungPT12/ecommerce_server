const express = require('express');
const orderController = require('../../controllers/client/order');
const { verifyUserToken } = require('../../verifyToken/verifyUserToken');
const router = express.Router();

router.post('/checkout', verifyUserToken, orderController.createOrder)
router.get('/orders', verifyUserToken, orderController.getOrders)
router.get('/order/:id', verifyUserToken, orderController.getOrderDetail)

module.exports = router