const Post = require('../models/post');
const {validationResult} = require('express-validator')
exports.getPosts = (req, res) => {
    Post
        .find()
        .then((allPosts) => {
            res
                .status(200)
                .json({posts: allPosts});
        })
        .catch(err => {
            console.log("From Controller/getPost : " + err);
        });
};

exports.createPost = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(422)
            .json({message: "This Input is not vaild", errors: errors.array()});
    }
    const title = req.body.title;
    const content = req.body.content;
    const newPost = new Post({title: title, content: content});
    newPost
        .save()
        .then((addedPost) => {
            res
                .status(201) //200: Successfully & 201: Successfully Added
                .json({message: 'Post Created Successfully', post: addedPost});
        })
        .catch(err => {
            console.log("From Controller/createPost: " + err);
        })
};

exports.getPostById = (req, res) => {
    const postId = req.params.id;
    Post
        .findById(postId)
        .then((post) => {
            res
                .status(200)
                .json({message: "Your post founded Successfully", post: post})
        })
        .catch((err) => {
            console.log("From Controller/getPostById: " + err);
        })

};