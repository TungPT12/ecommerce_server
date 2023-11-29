const express = require('express');

const loginController = require('../../../controllers/admin/auth/signin');
const router = express.Router();

router.post('/signin', loginController.signin);

module.exports = router;