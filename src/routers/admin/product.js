const express = require('express');
const productController = require('../../controllers/admin/product');
const { verifyAdminToken } = require('../../verifyToken/verifyAdminToken');
const router = express.Router();

router.post('/product', verifyAdminToken, productController.createProduct)
router.get('/products', verifyAdminToken, productController.getProducts)
router.get('/product/:id', verifyAdminToken, productController.getProductById)
router.put('/product/:id', verifyAdminToken, productController.updateProductById)
router.delete('/product/:id', verifyAdminToken, productController.deleteProductById)

module.exports = router