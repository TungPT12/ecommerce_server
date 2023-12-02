const express = require('express');
const cartController = require('../../controllers/client/cart');
const { verifyUserToken } = require('../../verifyToken/verifyUserToken');
const router = express.Router();

router.get('/cart', verifyUserToken, cartController.getCart)
router.post('/cart', verifyUserToken, cartController.addProductToCart)

module.exports = router;