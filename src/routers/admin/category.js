const express = require('express');
const categoryController = require('../../controllers/admin/category');
const { verifyAdminToken } = require('../../verifyToken/verifyAdminToken');
const router = express.Router();

router.post('/category', verifyAdminToken, categoryController.createCategory)
router.get('/categories', verifyAdminToken, categoryController.getCategories)
router.get('/category/:id', verifyAdminToken, categoryController.getCategoryById)
router.put('/category/:id', verifyAdminToken, categoryController.updateCategoryById)
router.delete('/category/:id', verifyAdminToken, categoryController.deleteCategory)

module.exports = router