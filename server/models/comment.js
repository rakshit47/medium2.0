const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment:{
        type: String,
        required: true
    },
    blogId:{
        type: mongoose.ObjectId,
        ref: 'Blog',
        required: true
    },
    userId:{
        type: mongoose.ObjectId,
        ref: 'User',
        required: true
    }
},{timestamps: true});

module.exports =  mongoose.model('Comments',commentSchema);