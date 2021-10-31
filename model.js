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

module.exports = {
    User
}