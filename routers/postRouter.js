const express = require('express');
const upload = require('../config/multerconfig');

const router = express.Router();
const postController = require('../controllers/postController.js');


router.post('/all', postController.getPosts);
router.post('/detail', postController.getPostById);
router.post('/create', postController.createPost);
router.post('/update', postController.updatePost);
router.post('/delete', postController.deletePost);
router.post('/uploadimages', upload.array('images', 10), postController.connectImage);

module.exports = router;
