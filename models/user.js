const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema(
    {name: String, email: String, password: String, posts:[{
        id:{
            type: Schema.Types.ObjectId,
            ref: 'Post'            
        },
        title: String,
        content: String,
    }], }
);
module.exports = mongoose.model('user', userSchema);