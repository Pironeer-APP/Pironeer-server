const postModel = require("../models/postModel");
const fs = require('fs');


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
      return res.status(400).json({ message: "url에 post_id 필요함" });
    }
    const [post, imagePaths] = await postModel.getPostById(id);
    console.log(imagePaths);
    const result = imagePaths.map(img => (img.img_url));
    console.log('result:', result);

    return res.status(200).json({ post: post, result: result });
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
  },
  connectImage: async (arr, id) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // post_id와 연결된 image데이터가 있다면 삭제
        const checkQuery = 'SELECT img_url FROM Image WHERE post_id=?;';
        const [existingImages] = await connection.query(checkQuery, [id]);

        if (existingImages.length > 0) {
            // 각 이미지 삭제
            const deletePromises = existingImages.map(img => {
                return new Promise((resolve, reject) => {
                    fs.unlink(img.img_url, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            console.log('Image deleted successfully:', img.img_url);
                            resolve();
                        }
                    });
                });
            });

            await Promise.all(deletePromises); // fs.unlink가 비동기함수이므로 모든 삭제 작업이 완료될때까지 대기

            const deleteQuery = 'DELETE FROM Image WHERE post_id=?;';
            await connection.query(deleteQuery, [id]);
        }

        // 연결된 image 없다면 그냥 밑에 로직 실행해서 이미지 등록
        const query = 'INSERT INTO Image (post_id, img_url) VALUES (?, ?);';
        for (let img of arr) {
            await connection.query(query, [id, img.path]);
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}
};
