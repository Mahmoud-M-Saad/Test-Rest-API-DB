const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postSchema = new Schema({title: String, content: String},{timestamps:true}); //timest.:to make Created/EditedAt

module.exports = mongoose.model('Post', postSchema);