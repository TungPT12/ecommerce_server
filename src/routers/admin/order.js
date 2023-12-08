const express = require('express');
const orderController = require('../../controllers/admin/order');
const { verifyAdminToken } = require('../../verifyToken/verifyAdminToken');
const router = express.Router();

// router.post('/category', verifyAdminToken, categoryController.createCategory)
router.get('/orders-new', verifyAdminToken, orderController.getOrdersNew)
// router.get('/category/:id', verifyAdminToken, categoryController.getCategoryById)
// router.put('/category/:id', verifyAdminToken, categoryController.updateCategoryById)
// router.delete('/category/:id', verifyAdminToken, categoryController.deleteCategory)

module.exports = router