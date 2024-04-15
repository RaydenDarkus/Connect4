const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Define the user schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensures email is unique
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
})

const userModel = mongoose.model('Registration', userSchema)

module.exports = userModel