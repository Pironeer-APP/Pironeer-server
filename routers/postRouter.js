const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController.js');

router.get('/:level/all', postController.getPosts);
router.get('/:level/:post_id', postController.getPostById);
router.post('/create/:level', postController.createPost);
router.post('/update/:post_id', postController.updatePost);
router.post('/delete/:post_id', postController.deletePost);
module.exports = router;
