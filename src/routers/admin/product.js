const express = require('express');
const productController = require('../../controllers/admin/product');
const { verifyAdminToken } = require('../../verifyToken/verifyAdminToken');
const router = express.Router();

router.post('/product', verifyAdminToken, productController.createProduct)
router.get('/products', verifyAdminToken, productController.getProducts)
// router.get('/category/:id', verifyAdminToken, productController.getCategoryById)
// router.put('/category/:id', verifyAdminToken, productController.updateCategoryById)
// router.delete('/category/:id', verifyAdminToken, productController.deleteCategory)

module.exports = router