const db = require('../config/db.js');

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
        const {title, content, category, due_date} = data;
        const query = 'INSERT INTO Post (level, title, content, category, due_date) VALUE (?, ?, ?, ?, ?);';
        const [createResult] = await db.query(query, [level, title, content, category, due_date]);
        
        return createResult.insertId;
    },
    updatePost: async (id, data) => {
        const {title, content, category, due_date} = data;
        const query = 'UPDATE Post SET title=?, conetent=?, category=?, due_date=? WHERE post_id=?;';
        const [updateResult] = await db.query(query, [title, content, category, due_date, id]);

        return updateResult.insertId;
    }

}


const updatePost = async (id, data) => {
    const { level, title, content, category, due_date } = data;
    await db.query('UPDATE Post SET level = ?, title = ?, content = ?, category = ?, due_date = ? WHERE post_id = ?', [level, title, content, category, due_date, id]);
};

const deletePost = async (id) => {
    await db.query('DELETE FROM Post WHERE post_id = ?', [id]);
};


