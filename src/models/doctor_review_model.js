const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReviewSchema = new Schema({
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
    rating: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: true,
    },
    reviewer_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
})

const Review = mongoose.model('review', ReviewSchema)

module.exports = Review