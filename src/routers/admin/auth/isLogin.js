const express = require('express');

const isLoginController = require('../../../controllers/admin/auth/isLogin');
const router = express.Router();

router.post('/is-login', isLoginController.isLogin);

module.exports = router;