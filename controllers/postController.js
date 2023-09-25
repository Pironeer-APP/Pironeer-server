const postModel = require('../models/postModel');

module.exports = {
    getPosts: async(req, res) => {
        const level = req.params.level;
        
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
    createPost: async(req, res) => {
        const level = req.params.level; 
        const postData = req.body;
        const newPostId = await postModel.createPost(level, postData);
        
        if (newPostId) {
            res.status(201).json({message: '새로운 post 생성 성공', newPostId: newPostId});
            console.log('새로운 post 생성 성공');
        } else {
            res.status(400).json({message: '새로운 post 생성 실패'});
            console.log('새로운 post 생성 실패');
        };
    }
}