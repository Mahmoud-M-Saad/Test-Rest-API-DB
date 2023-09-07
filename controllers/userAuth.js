const User = require('../models/user');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getUsers = (req, res) => {
    User
        .find()
        .then((users) => {
            res
                .status(200)
                .json({message: "Successfully", users});
        })
        .catch((err) => {
            console.log("From Controller/getUsers: " + err);
            return res
                .status(400)
                .json({errors: err.errors});
        })
    };

exports.createUser = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(422)
            .json({message: "This Input is not vaild", errors: errors.array()});
    }
    const {name, email, password} = req.body;
    User
        .findOne({email: email})
        .then((user) => {
            if (user) {
                return res
                    .status(400)
                    .json({message: "User already exists"});
            } else {
                bcrypt
                    .hash(password, 12)
                    .then(hashedPW => {
                        const newUser = new User({name, email, password: hashedPW});
                        return newUser.save()
                    })
                    .then((newUser) => {
                        res
                            .status(201)
                            .json({message: 'User Created Successfully', user_ID: newUser._id});
                    })
                    .catch((err) => {
                        console.log("From Controller/createUser/inner: " + err);
                        return res
                            .status(400)
                            .json({errors: err.errors});
                    })
                }
        })
        .catch(err => {
            console.log("From Controller/createUser/outter: " + err);
        })
    };

exports.login = (req, res) => {
    const {email, password} = req.body;
    User
        .findOne({email: email})
        .then(user => {
            if (!user) {
                return res
                    .status(401)
                    .json({message: "User not found"});
            } else {
                bcrypt
                    .compare(password, user.password)
                    .then(isMatch => {
                        if (!isMatch) {
                            res
                                .status(401)
                                .json({message: "Invalid password"});
                        } else {
                            const token = jwt.sign({
                                user_ID: user._id,
                                name: user.name,
                                email: user.email
                            }, 'somesupersecretsecret', { expiresIn: '1h' });
                            res
                                .status(200)
                                .json({message: "You are logged in", token: token, user_Name: user.name});
                        }
                    })
                    .catch(err => {
                        console.log("From Controller/login: " + err);
                        return res
                            .status(400)
                            .json({errors: err.errors});
                    })
                }
        })
        .catch(err => {
            console.log("From Controller/login: " + err);
            return res
                .status(400)
                .json({errors: err.errors});
        });
};

exports.deleteUserById = (req, res) => {
    const userId = req.params.id;
    User
        .findById(userId)
        .then((user) => {
            if (!user) {
                return res
                    .status(404)
                    .json({message: 'User not found'});
            }
            User
                .findByIdAndDelete(userId)
                .then(() => {
                    res
                        .status(200)
                        .json({message: "Your user deleted Successfully"})
                })
                .catch((err) => {
                    console.log("From Controller/deleteUser: " + err);
                    return res
                        .status(400)
                        .json({errors: err.errors});
                })
            })
        .catch((err) => {
            console.log("From Controller/deleteUser: " + err);
            return res
                .status(400)
                .json({errors: err.errors});
        })
    };