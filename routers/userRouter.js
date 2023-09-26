const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

router.post('/getOneUserInfo', userController.getOneUserInfo);

module.exports = router;