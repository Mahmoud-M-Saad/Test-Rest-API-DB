const express = require('express');
const feedController = require('../controllers/feed');
const router = express.Router();
const {body} = require('express-validator');

const isAuth = require('../middleware/isAuth');

router.get('/posts',isAuth, feedController.getPosts);

router.post('/posts',isAuth, [
    body('title')
        .trim()
        .isLength({min: 5}),
    body('content')
        .trim()
        .isLength({min: 5})
], feedController.createPost);

router.get('/posts/:id',isAuth, feedController.getPostById);

router.delete('/posts/:id',isAuth, feedController.deletePostById);

router.put('/posts/:id',isAuth, [
    body('title')
        .trim()
        .isLength({min: 5}),

    body('content')
        .trim()
        .isLength({min: 5})
], feedController.updatePostById);

module.exports = router;