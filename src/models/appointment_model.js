const mongoose = require('mongoose')
const Schema = mongoose.Schema

const appointmentSchema = new Schema({
    start_time: {
        type: String,
        required: true,
    },
    end_time: {
        type: String,
    },
    date: {
        type: Date,
        required: true,
    },
    appointment_subject:{
        type: String,
        default: null,
    },
    appointment_summary:{
        type: String,
        default: null,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['frontal', 'remote']
    },
})

const appointmentRecord = mongoose.model('appointment', appointmentSchema)

module.exports = appointmentRecord