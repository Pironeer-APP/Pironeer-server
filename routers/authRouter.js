const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');

router.post('/login', authController.login);
router.post('/addUser', authController.addUser);
router.post('/compareInfo/:type', authController.compareInfo);
router.post('/updateInfo/:type', authController.updateInfo);

module.exports = router;