const express = require('express');
const router = express.Router();
const depositController = require('../controllers/depositController.js');

router.get('/:user_id', depositController.viewDeposit);

module.exports = router;