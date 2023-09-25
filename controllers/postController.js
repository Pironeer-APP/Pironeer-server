const postModel = require('../models/postModel');

module.exports = {
    getPosts: async(req, res) => {
        const level = req.params.level;
        console.log(level);
        if (!level) {
            return res.status(400).json({message: "url에 level 필요함"})
        }

        const posts = await postModel.getPosts(level);
        return res.status(200).json({posts: posts});
    },
    getPostById: async(req, res) => {
        const id = req.params.post_id;
        
        if (!id) {
            return res.status(400).json({message: "url에 id 필요함"})
        }
        
        const post = await postModel.getPostById(id);
        return res.status(200).json({post:post});
    },
}