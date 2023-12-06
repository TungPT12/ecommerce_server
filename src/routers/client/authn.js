const express = require('express');

const authnController = require('../../controllers/client/authn');
const router = express.Router();

router.post('/signin', authnController.signin);
router.post('/signup', authnController.signup);
router.post('/access-token', authnController.isAccessToken);
router.post('/logout', authnController.logout);

module.exports = router;