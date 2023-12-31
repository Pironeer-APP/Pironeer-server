const postModel = require("../models/postModel");
const fs = require('fs');
require('dotenv').config();
const { initializeApp } = require('firebase-admin/app');

module.exports = {
  getPosts: async (req, res) => {
    const decoded = req.body.account;
    const level = decoded.level;
    const posts = await postModel.getPosts(level);

    return res.status(200).json({ posts: posts });
  },
  getPostById: async (req, res) => {
    const id = req.body.post_id;
    const [post, imagePaths] = await postModel.getPostById(id);
    //console.log(imagePaths);
    const result = imagePaths.map(img => (img.img_url));
    //console.log('result:', result);

    res.status(200).json({ post: post, result: result });
  },
  createPost: async (req, res) => {
    const decoded = req.body.account;

    if (decoded.is_admin === 1) {
      const level = decoded.level;
      const createData = [req.body.title, req.body.content, req.body.category];

      console.log("받아온 level:", level, "받아온 데이터:\n", createData);

      const createdPostId = await postModel.createPost(level, createData);

      if (createdPostId) {
        res
          .status(201)
          .json({ message: "post 생성 성공", createdPostId: createdPostId });
        console.log("post 생성 성공");
      } else {
        res.status(400).json({ message: "post 생성 실패" });
        console.log("post 생성 실패, 위치: postController");
      }
    }
  },
  updatePost: async (req, res) => {
    const decoded = req.body.account;

    if (decoded.is_admin === 1) {
      const id = req.body.post_id;
      const updateData = [req.body.title, req.body.content, req.body.category];
      console.log("받아온 id:", id, "받아온 데이터:\n", updateData);

      const updatedRows = await postModel.updatePost(id, updateData);

      if (updatedRows == 1) {
        res.status(201).json({ message: "post 업데이트 성공", updatedPostId: id });
        console.log(`post 업데이트 성공 post_id: ${id}`);
      } else {
        res.status(400).json({ message: "post 업데이트 오류" });
        console.log(`Post with ID ${id} 여러개의 행 수정됐거나 해당 행 발견되지 않음.`);
      }
    }
  },
  deletePost: async (req, res) => {
    const decoded = req.body.account;
    if (decoded.is_admin === 1) {
      const id = req.body.post_id;
      const [deletedRows, imgPaths] = await postModel.deletePost(id);

      //각 이미지 삭제
      imgPaths.forEach(img => {
        fs.unlink(img.img_url, (err) => {
          if (err) {
            console.error('Error deleting the image:', err);
          } else {
            console.log('Image deleted successfully:', img.img_url);
          }
        });
      });

      if (deletedRows == 1) {
        res.status(200).json({ message: "Post deleted successfully." });
        console.log(`Post테이블 post_id:${id} 삭제 성공.`);
      } else {
        res.status(404).json({ message: "Post 없거나 하나 이상의 행 삭제됨." });
        console.log(`Post with ID ${id} 여러개의 행 삭제됐거나 해당 행 발견되지 않음.`);
      }
    }
  },
  connectImage: async (req, res) => {
    console.log('image..', req);
    const image_array = req.files;
    const post_id = req.body.post_id

    try {
      await postModel.connectImage(image_array, post_id);
      res.status(200).json({ message: '이미지 업로드 성공' });
    } catch (error) {
      console.error('이미지 업로드 중 오류 발생:', error);
      res.status(500).json({ message: '서버 내부 오류' });
    }
  }
};