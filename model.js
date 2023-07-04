const e = require('express');
const mongoose = require('mongoose');
const {
    Schema
} = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
})

const User = mongoose.model('Information', userSchema);

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    likes: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        required: true,
        enum: ['joke', 'meme', 'quote', 'fact', 'thought']
    },
    postedBy: {
        type: String,
        ref: 'User'
    },
});

const Post = mongoose.model('Post', postSchema);

const commentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    ofPost: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    commentedBy: {
        type: String,
        ref: 'User'
    }
});

const Comment = mongoose.model('Comment', commentSchema);

const likeSchema = new Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    ofPost: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    likedBy: {
        type: String,
        ref: 'User'
    }
})

const Like = mongoose.model('Like', likeSchema)

module.exports = {
    User,
    Post,
    Comment,
    Like
}
