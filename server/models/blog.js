const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    imageUrl:{
        type: String,
        required: false
    },
    tags:{
        type: Array
    },
    likes:{
        type: Array
    },
    userId:{
        type: mongoose.ObjectId,
        ref: 'User'
    }
},{ timestamps: true })

module.exports = mongoose.model('Blog',blogSchema)
