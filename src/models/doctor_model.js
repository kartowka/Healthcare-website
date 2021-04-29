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
    }
})

const Doctor = mongoose.model('doctor_details', doctorDetails)

module.exports = Doctor