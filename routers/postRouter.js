const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController.js');

router.get('/', postController.getPosts);

module.exports = router;