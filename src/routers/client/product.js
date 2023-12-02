const express = require('express');
const productController = require('../../controllers/client/product');
const router = express.Router();

router.get('/products', productController.getProducts)
router.get('/top-trending-product', productController.getTopTrendingProducts)
router.get('/product/:id', productController.getProductById)
router.get('/product-by-category/:categoryId', productController.getProductByCategoryId)

module.exports = router;