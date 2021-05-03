const mongoose = require('mongoose')
const Scheme = mongoose.Schema

const doctorDetails = new Scheme({
    bio: {
        type: String,
    },
    working_days: {
        type: [String],
        enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    start_time: {
        type: String
    },
    end_time: {
        type: String
    },
    clinic_address: {
        type: String
    },
    clinic_city: {
        type: String
    },
    specialization: {
        type: [String]
    },
    spoken_languages: {
        type: [String]
    },
    clinic_phone_number: {
        type: String
    },
    // medical_license_id: {
    //     type: String,
    //     default: null,
    // },
    // doctor_related_clinics: {
    //     type: [String],
    //     enum: ['Clalit', 'Meuhedet', 'Macabi', 'Leumit'],
    // }, sprint4
})

const Doctor = mongoose.model('doctor_details', doctorDetails)

module.exports = Doctor