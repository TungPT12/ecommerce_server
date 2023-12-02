const express = require('express');
const productController = require('../../controllers/client/product');
const router = express.Router();

router.get('/products', productController.getProducts)
router.get('/top-trending-product', productController.getTopTrendingProducts)

module.exports = router;