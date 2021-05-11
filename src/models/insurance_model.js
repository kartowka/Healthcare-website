const mongoose = require('mongoose')
const Scheme = mongoose.Schema

const DateSchema = mongoose.Schema({
    start_date: String,
    end_date: String,
})

const InsuranceSchema = new Scheme({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    ID: {
        type: String,
        required: true,
    },
    insurance_type: {
        type: String,
        required: true,
        enum: ['standard', 'extreme_sports', 'chronic_diseases'],
    },
    destination: {
        type: String,
        required: true,
    },
    dates: {
        type: DateSchema,
        required: true,
    },
    insurance_reference: {
        type: String
    },
})

const Insurance = mongoose.model('insurance_details', InsuranceSchema)

module.exports = Insurance