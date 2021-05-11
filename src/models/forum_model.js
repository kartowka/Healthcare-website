const mongoose = require('mongoose')
const Schema = mongoose.Schema

const questionSchema = new Schema({
    topic: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    question_body: {
        type: String,
        required: true,
    },
    asked_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
})

const commentSchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    comment_body: {
        type: String,
        required: true,
    },
    commented_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
})

const forumSchema = new Schema({
    question: {
        type: questionSchema,
        required: true,
    },
    comment: {
        type: commentSchema,
        required: true,
    },
})

const Forum = mongoose.model('user', forumSchema)

module.exports = Forum