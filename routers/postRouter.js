const express = require('express');
const upload = require('../config/multerconfig');

const router = express.Router();
const postController = require('../controllers/postController.js');


router.post('/:level/all', postController.getPosts);
// level 없애고 body에 level, userToken 받도록 수정
router.post('/:level/:post_id', postController.getPostById);
// level 없애고 body에서 userToken 받도록 수정(post_id는 고유하므로 level 받을 필요 없을듯) 
router.post('/create/:level', postController.createPost);
router.post('/update/:post_id', postController.updatePost);
router.post('/delete/:post_id', postController.deletePost);
router.post('/uploadimages', upload.array('images', 10), postController.connectImage);

module.exports = router;
