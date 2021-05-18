const User = require('../models/user_model')
const DoctorDetails = require('../models/doctor_model')
const Appointment = require('../models/appointment_model')

exports.make_an_Appointment = async (req, res, next) => {
	
	try {
		let appointment_details = req.body
		let doctor = await DoctorDetails.findOne({ _doctor_id: req.params.id })
		let full_date = appointment_details.date.split(' ')
		
		if(doctor._doctor_id == res.locals.loggedInUser._id){
			throw 'A doctor cannot make an appointment for himself!'
		}

		const newAppointment = new Appointment({
			start_time: full_date[1],
			date: full_date[0],
			appointment_subject: appointment_details.appointment_subject,
			doctor: doctor._id,
			patient: res.locals.loggedInUser._id,
			type: appointment_details.type,
		})
		await newAppointment.save()
		next()
		
	} catch (error) {
		let statusCode = '401'
		res.redirect(`/restricted/${error}/${statusCode}`)
	}
}

exports.getAppointments = async (req, res, next) => {

	try {
		const userId = req.params.id
		const user = await User.findById(userId)
		if (!user) {
			throw new Error('User does not exist')
		}
		const appointment_details = await Appointment.find({ patient: userId })
		req.appointment_details = appointment_details
		const doctor_details = []
		const user_doctor = []
		if(appointment_details != []){
			for(let i = 0; i < appointment_details.length; ++i){
				let doctor = await DoctorDetails.findOne({ _id: appointment_details[i].doctor })
				let  user = await User.findOne({ _id: doctor._doctor_id })
				doctor_details.push(doctor)
				user_doctor.push(user)
			}
		}
		req.doctor_details = doctor_details
		req.user_doctor = user_doctor
		next()
				
	} catch (error) {
		let statusCode = '401'
		res.redirect(`/restricted/${error}/${statusCode}`)
	}


}

