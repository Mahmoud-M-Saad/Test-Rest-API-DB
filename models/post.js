const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postSchema = new Schema({
    title: String,
    content: String,
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, {timestamps: true}); //timest.:to make Created/EditedAt

module.exports = mongoose.model('Post', postSchema);