const mongoose = require('mongoose')
const Schema = mongoose.Schema

const forumSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['topic', 'comment'],
    },
    date: {
        type: Date,
        required: true,
    },
    //patient and doctor information like name can be taken from their own Schema
})

const Forum = mongoose.model('user', forumSchema)

module.exports = Forum