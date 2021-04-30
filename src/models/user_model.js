const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
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
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'patient',
        enum: ['admin', 'doctor', 'patient']
    },
    clinic: {
        type: String,
        enum: ['Clalit', 'Meuhedet', 'Macabi', 'Leumit'],
        default: '',
        required: true
    },
    medical_license_id: {
        type: String,
        default: null,
    },
    doctor_related_clinics: {
        type: [String],
        enum: ['Clalit', 'Meuhedet', 'Macabi', 'Leumit'],
    },
    status: {
        type: String,
        enum: ['Pending', 'Active', 'Waiting for Admin Approval'],
        default: 'Pending'
    },
    accessToken: {
        type: String
    }
})

const User = mongoose.model('user', UserSchema)

module.exports = User