const postModel = require('../models/postModel');

module.exports = {
    getPosts: async(req, res) => {
        const level = req.query.level;
        const category = req.query.category;

        if (!level || !category) {
            return res.status(400).json({message: "level이랑 category 필요함"})
        }

        const posts = await postModel.getPosts(level, category);
        console.log(posts)
        return res.status(200).json({posts: posts})
    }
}