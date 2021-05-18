//const User = require('../models/user_model')
const DoctorDetails = require('../models/doctor_model')
const Appointment = require('../models/appointment_model')


exports.make_an_Appointment = async (req, res, next) => {
    
    try {
        let update = req.body
        let userId = req.params.id
        // let user = await User.findById(userId)
        let doctor = await DoctorDetails.findOne({ _doctor_id: userId })
        
        const newAppointment = new Appointment({
            start_time: update.start_time,
            date: update.date, 
            appointment_subject: update.appointment_subject,
            doctor: doctor,
            // patient: user,
            type: update.type,
        }) 

    
    } catch (error) {
        req.error = { Message: error, statusCode: '200' }
        res.status(200)
        res.redirect(req.get('referer'))
    }
}
