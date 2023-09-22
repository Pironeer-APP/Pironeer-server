const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');

router.get('/login', authController.login);
router.post('/addUser', authController.addUser);

module.exports = router;