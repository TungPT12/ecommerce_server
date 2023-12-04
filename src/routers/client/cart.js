const express = require('express');
const cartController = require('../../controllers/client/cart');
const { verifyUserToken } = require('../../verifyToken/verifyUserToken');
const router = express.Router();

router.get('/cart', verifyUserToken, cartController.getCart)
router.post('/cart', verifyUserToken, cartController.addProductToCart)
router.delete('/cart/:productId', verifyUserToken, cartController.deleteProductInCart)
router.put('/cart', verifyUserToken, cartController.decreaseProductInCart)

module.exports = router;