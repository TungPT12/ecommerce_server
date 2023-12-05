const express = require('express');
const categoryController = require('../../controllers/client/category');
const router = express.Router();

router.get('/categories', categoryController.getCategories)

module.exports = router