const express = require('express');
const userController = require('../controllers/userAuth');
const router = express.Router();
const {body} = require('express-validator');

router.get('/users', userController.getUsers);
router.post('/users', [
    body('name')
        .trim()
        .isLength({min: 5}),
    body('email').trim(),
    body('password').trim()
], userController.createUser);

router.post('/login',userController.login);

router.delete('/users/:id',userController.deleteUserById);

module.exports = router;