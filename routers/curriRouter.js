const express = require('express');
const router = express.Router();
const curriController = require('../controllers/curriController.js');

router.post('/', curriController.getUrl);

module.exports = router;