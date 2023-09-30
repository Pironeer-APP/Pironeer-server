const db = require("../config/db.js");

module.exports = {
  //0  === 전체, 1 === 세션, 2 === 과제, 3 === 기타
  getPosts: async (level) => {
    const query = 'SELECT * FROM Post WHERE level=? ORDER BY post_id DESC;';
    const [posts] = await db.query(query, [level]);

    return posts;
  },
  getPostById: async (id) => {
    const query = 'SELECT * FROM Post WHERE post_id=?;';
    const [post] = await db.query(query, [id]);

    return post[0];
  },
  createPost: async (level, data) => {
    const { title, content, category } = data;
    const query = 'INSERT INTO Post (level, title, content, category) VALUE (?, ?, ?, ?);';
    const [createResult] = await db.query(query, [
      level,
      title,
      content,
      category,
    ]);

    return createResult.insertId;
  },
  updatePost: async (id, data) => {
    const { title, content, category } = data;
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
    const [deleteResult] = await db.query(query, [id]);

    return deleteResult.affectedRows;
  },
  connetImage: async () => {

  },
};

