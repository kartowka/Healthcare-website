const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReviewSchema = new Schema({
    reviewer_first_name: {
        type: String,
        required: true,
    },
    reviewer_last_name: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    review: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
})

const Review = mongoose.model('user', ReviewSchema)

module.exports = Review