const mongoose = require('mongoose')
const Schema = mongoose.Schema

const appointmentRecordSchema = new Schema({
    start_time: {
        type: String,
        required: true,
    },
    end_time: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    doctor_name: {
        type: String,
        required: true,
    },
    working_field: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    telephone_number: {
        type: [String],
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['frontal','remote']
    },
})

const appointmentRecord = mongoose.model('user', appointmentRecordSchema)

module.exports = appointmentRecord