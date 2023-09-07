const Post = require('../models/post');
const User = require('../models/user');
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
    let creator;
    const title = req.body.title;
    const content = req.body.content;
    const newPost = new Post(
        {title: title, content: content, creator: req.user_ID}
    );
    newPost
        .save()
        .then(() => {
            return User.findById(req.user_ID);
        })
        .then(user => {
            creator = user;
            user
                .posts
                .push(newPost);
            return user.save();
        })
        .then((addedPost) => {
            res
                .status(201) //200: Successfully & 201: Successfully Added
                .json(
                    {message: 'Post Created Successfully', post: addedPost.posts, CreatorName: creator.name}
                );
        })
        .catch(err => {
            console.log("From Controller/createPost: " + err);
            return res
                .status(400)
                .json({errors: err.errors});
        })
    };

exports.getPostById = (req, res) => {
    const postId = req.params.id;
    Post
        .findById(postId)
        .then((post) => {
            if (!post) {
                return res
                    .status(422)
                    .json({message: "This Post is not Found"});
            }
            res
                .status(200)
                .json({message: "Your post founded Successfully", post: post})

        })
        .catch((err) => {
            console.log("From Controller/getPostById: " + err);
        })

    };

exports.updatePostById = (req, res) => {
    const postId = req.params.id;
    const errors = validationResult(req);
    const title = req.body.title;
    const content = req.body.content;
    if (!errors.isEmpty()) {
        return res
            .status(422)
            .json({message: "This Input is not vaild", errors: errors.array()});
    }
    Post
        .findById(postId)
        .then((post) => {
            if (!post) {
                return res
                    .status(422)
                    .json({message: "This Post is not Found"});
            }
            if (post.creator.toString() !== req.user_ID) {
                return res
                    .status(401)
                    .json({message: "Sorry you aren't the user who create this post"})
            } else {
                post.title = title;
                post.content = content;
                return post.save();
            }
        })
        .then((updatedPost) => {
            if (!updatedPost) {
                return res
                    .status(401)
                    .json({message: "post can't be edited!"})
            }
            res
                .status(200)
                .json({message: "Your post updated Successfully", post: updatedPost});
        })
        .catch((err) => {
            console.log("From Controller/updatePostById: " + err);
        })
    };

exports.deletePostById = (req, res) => {
    const postId = req.params.id;
    Post
        .findById(postId)
        .then((post) => {
            if (!post) {
                return res
                    .status(422)
                    .json({message: "This Post is not Found"});
            }
            Post
                .findByIdAndDelete(postId)
                .then((post) => {
                    if (post.creator.toString() !== req.user_ID) {
                        return res
                            .status(401)
                            .json({message: "Sorry you aren't the user who create this post"})
                    } else {
                        User
                            .findById(req.user_ID)
                            .then((user) => {
                                user
                                    .posts
                                    .pull(postId);
                                return user.save();
                            })
                            .then(() => {
                                res
                                    .status(200)
                                    .json({message: "Your post deleted Successfully"})
                            })
                    }
                })
                .catch((err) => {
                    console.log("From Controller/deletePostById/inner: " + err);
                })
            })
        .catch((err) => {
            console.log("From Controller/deletePostById/outer: " + err);
        })
    };