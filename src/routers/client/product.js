const express = require('express');
const productController = require('../../controllers/client/product');
const router = express.Router();

router.get('/product', productController.getProduct)

module.exports = router;