const express = require('express');
const categoryController = require('../../controllers/admin/category');
const { verifyAdminToken } = require('../../verifyToken/verifyAdminToken');
const router = express.Router();

router.post('/category', verifyAdminToken, categoryController.createCategory)
router.get('/categories', verifyAdminToken, categoryController.getCategories)

module.exports = router