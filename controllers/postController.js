const postModel = require("../models/postModel");

module.exports = {
  getPosts: async (req, res) => {
    const level = req.params.level;

    if (!level) {
      return res.status(400).json({ message: "url에 level 필요함" });
    }

    const posts = await postModel.getPosts(level);
    return res.status(200).json({ posts: posts });
  },
  getPostById: async (req, res) => {
    const id = req.params.post_id;

    if (!id) {
      return res.status(400).json({ message: "url에 id 필요함" });
    }

    const post = await postModel.getPostById(id);
    return res.status(200).json({ post: post });
  },
  createPost: async (req, res) => {
    const level = req.params.level;
    const createData = req.body;
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
  },
  updatePost: async (req, res) => {
    const id = req.params.post_id;
    const updateData = req.body;
    console.log("받아온 id:", id, "받아온 데이터:\n", updateData);

    const updatedRows = await postModel.updatePost(id, updateData);

    if (updatedRows == 1) {
      res.status(201).json({ message: "post 업데이트 성공", updatedPostId: id });
      console.log(`post 업데이트 성공 post_id: ${id}`);
    } else {
      res.status(400).json({ message: "post 업데이트 오류" });
      console.log(`Post with ID ${id} 여러개의 행 수정됐거나 해당 행 발견되지 않음.`);
    }
  },
  deletePost: async (req, res) => {
    const id = req.params.post_id;
    const deletedRows = await postModel.deletePost(id);

    if (deletedRows == 1) {
      res.status(200).json({ message: "Post deleted successfully." });
      console.log(`Post테이블 post_id:${id} 삭제 성공.`);
    } else {
      res.status(404).json({ message: "Post 없거나 하나 이상의 행 삭제됨." });
      console.log(`Post with ID ${id} 여러개의 행 삭제됐거나 해당 행 발견되지 않음.`);
    }
  },
  connectImage: async (req, res) => {
    
  },
};
