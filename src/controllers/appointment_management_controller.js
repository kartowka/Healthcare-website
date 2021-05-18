const DoctorDetails = require('../models/doctor_model')
const Appointment = require('../models/appointment_model')

exports.make_an_Appointment = async (req, res, next) => {
	try {
		let appointment_details = req.body
		let doctor_id = await DoctorDetails.findOne({ _doctor_id: req.params.id })
		let full_date = appointment_details.date.split(' ')
		
		if(doctor_id == res.locals.loggedInUser._id){
			throw 'A doctor cannot make an appointment for himself!'
		}

		
		const newAppointment = new Appointment({
			start_time: full_date[1],
			date: full_date[0],
			appointment_subject: appointment_details.appointment_subject,
			doctor: doctor_id,
			patient: res.locals.loggedInUser._id,
			type: appointment_details.type,
		})
		await newAppointment.save()
		next()

	

		
	} catch (error) {
		let statusCode = '401'
		console.log(error)
		res.redirect(`/restricted/${error}/${statusCode}`)
	}
}
