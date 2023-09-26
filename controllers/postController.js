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
        const createData = req.body;
        console.log('받아온 level:', level, '받아온 데이터:\n', createData);

        const createdPostId = await postModel.createPost(level, createData);
        
        if (createdPostId) {
            res.status(201).json({message: 'post 생성 성공', createdPostId: createdPostId});
            console.log('post 생성 성공');
        } else {
            res.status(400).json({message: 'post 생성 실패'});
            console.log('post 생성 실패, 위치: postController');
        };
    },
    updatePost: async(req, res) => {
        const id = req.params.post_id;
        const updateData = req.body;
        console.log('받아온 id:', id, '받아온 데이터:\n', updateData);

        const updatedPostId = await postModel.updatePost(id, updateData);

        if (updatedPostId) {
            res.status(201).json({message: 'post 업데이트 성공', updatedPostId: updatedPostId});
            console.log('post 업데이트 성공');
        } else {
            res.stauts(400).json({message: 'post 업데이트 실패'});
            console.log('post 업데이트 실패, 위치: postController');
        };
    }
}