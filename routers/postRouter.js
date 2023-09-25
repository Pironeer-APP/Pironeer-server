const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController.js');

router.get('/:level/all', postController.getPosts);
router.get('/:level/:post_id', postController.getPostById);
router.post('/:level/create', postController.createPost);
module.exports = router;
