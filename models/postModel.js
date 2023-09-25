const db = require('../config/db.js');

module.exports = {
    //0  === 전체, 1 === 세션, 2 === 과제, 3 === 기타  
    getPosts: async (level, category) => {
        if (category === 0) {
            const query = 'SELECT * FROM Post WHERE level=?;';
            const [posts] = await db.query(query, [level]);
        } else {
            const query = 'SELECT * FROM Post WHERE level=? AND category=?;';
            const [posts] = await db.query(query, [level, category]);
        }
        console.log(posts);
        return posts;
    },
}

const getPostById = async (id) => {
    const [rows] = await db.query('SELECT * FROM Post WHERE post_id = ?', [id]);
    return rows[0];
};

const createPost = async (data) => {
    const { level, title, content, category, due_date } = data;
    const [result] = await db.query('INSERT INTO Post (level, title, content, category, due_date) VALUES (?, ?, ?, ?, ?)', [level, title, content, category, due_date]);
    return result.insertId;
};

const updatePost = async (id, data) => {
    const { level, title, content, category, due_date } = data;
    await db.query('UPDATE Post SET level = ?, title = ?, content = ?, category = ?, due_date = ? WHERE post_id = ?', [level, title, content, category, due_date, id]);
};

const deletePost = async (id) => {
    await db.query('DELETE FROM Post WHERE post_id = ?', [id]);
};


