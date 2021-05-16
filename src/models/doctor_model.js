const mongoose = require('mongoose')
const Scheme = mongoose.Schema

const AddressSchema = mongoose.Schema({
    city: {
        type: String,
        default: '',
    },
    street: {
        type: String,
        default: '',
    }
})

const doctorDetailsSchema = new Scheme({
    _doctor_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    medical_license_id: {
        type: String,
        unique: true,
        required: true,
    },
    doctor_related_clinics: {
        type: [String],
        enum: ['Clalit', 'Meuhedet', 'Macabi', 'Leumit'],
        required: true,
    },
    bio: {
        type: String,
        default: '',
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
    specialization: {
        type: [String],
        default: [''],
    },
    clinic_address: {
        type: AddressSchema,
        default: () => ({}),
    },
    spoken_languages: {
        type: [String],
        default: ['']
    },
    clinic_phone_number: {
        type: String,
        default: '',
    },
})

const DoctorDetails = mongoose.model('doctor_details', doctorDetailsSchema)

module.exports = DoctorDetails