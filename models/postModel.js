const db = require("../config/db.js");
const fs = require('fs');


module.exports = {
  //0  === 전체, 1 === 세션, 2 === 과제, 3 === 기타
  getPosts: async (level) => {
    const query = 'SELECT * FROM Post WHERE level=? ORDER BY post_id DESC;';
    const [posts] = await db.query(query, [level]);

    return posts;
  },
  getPostById: async (id) => {
    const query = 'SELECT * FROM Post WHERE post_id=?;';
    const imagequery = 'SELECT img_url FROM Image WHERE post_id=?;';

    const [imagePaths] = await db.query(imagequery, [id])
    const [post] = await db.query(query, [id]);

    return [post[0], imagePaths];
  },
  createPost: async (level, data) => {
    const [title, content, category] = data;
    const query = 'INSERT INTO Post (level, title, content, category) VALUES (?, ?, ?, ?);';
    const [createResult] = await db.query(query, [
      level,
      title,
      content,
      category,
    ]);

    return createResult.insertId;
  },
  updatePost: async (id, data) => {
    const [title, content, category] = data;
    const query = 'UPDATE Post SET title=?, content=?, category=? WHERE post_id=?;';
    const [updateResult] = await db.query(query, [
      title,
      content,
      category,
      id,
    ]);

    return updateResult.affectedRows;
  },
  deletePost: async (id) => {
    const query = 'DELETE FROM Post WHERE post_id=?;';
    const imgQuery = 'SELECT img_url FROM Image WHERE post_id=?;';
    
    const [imgPaths] = await db.query(imgQuery, [id]);
    const [deleteResult] = await db.query(query, [id]);
    //쿼리 실행 결과: [ { img_url: 'path/to/image1.jpg' },  { img_url: 'path/to/image2.jpg' },  ...]
    console.log(imgPaths);

    return [deleteResult.affectedRows, imgPaths];
  },
  connectImage: async (arr, id) => {
    //post_id와 연결된 image데이터가 있다면 삭제
    const checkQuery = 'SELECT img_url FROM Image WHERE post_id=?;';
    const [imgPaths] = await db.query(checkQuery, [id]);
    
    const deleteQuery = 'DELETE FROM Image WHERE post_id=?;';
    if (imgPaths.length > 0) {
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
      await db.query(deleteQuery, [id]);
    }

    //연결된 image 없다면 그냥 밑에 로직 실행해서 이미지 등록
    const query = 'INSERT INTO Image (post_id, img_url) VALUES (?, ?);';
    console.log('arr:', arr); 
    
    let img_url;
    for (let img of arr) {
      img_url = img.path;
      console.log(img_url)
      await db.query(query, [id, img_url]);
    }
  }
};

