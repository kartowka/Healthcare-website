const User = require('../models/user_model')
const DoctorDetails = require('../models/doctor_model')
const Appointment = require('../models/appointment_model')
const { update } = require('../models/user_model')

exports.make_an_Appointment = async (req, res, next) => {
	try {
		let appointment_details = req.body
		let appointment_date = new Date(req.body.date + 'Z')
		let minutes = appointment_date.getUTCMinutes()
		let hours = appointment_date.getUTCHours()
		if(minutes < 10){
			minutes = '0'+ minutes
		}
		if(hours < 10){
			hours = '0'+ hours
		}

		let doctor = await DoctorDetails.findOne({ _doctor_id: req.params.id })
		
		if(doctor._doctor_id == res.locals.loggedInUser._id){
			throw 'A doctor cannot make an appointment for himself!'
		}

		const newAppointment = new Appointment({
			start_time: hours +':'+ minutes,
			date: appointment_date,
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


async function allAppointmentsOfUser(req){

	try {
		const userId = req.params.id
		const user = await User.findById(userId)
		if (!user) {
			throw new Error('User does not exist')
		}
		
		let appointment_details = []

		if(user.role == 'patient'){
			appointment_details = await Appointment.find({ patient: userId })
			
		} 
		else if(user.role == 'doctor'){
			let doctor = await DoctorDetails.findOne({ _doctor_id: userId })
			appointment_details = await Appointment.find({ doctor: doctor._id })
		}

		return appointment_details
				
	} catch (error) {
		req.error = error
	}

}



exports.getAppointments = async (req, res, next) => {

	try {

		let appointment_details = await allAppointmentsOfUser(req)
		
		
		if(appointment_details != []){

			let doctor_details = []
			let user_doctor = []
			let user_patient =[]

			for(let i = 0; i < appointment_details.length; ++i){
				let doctor = await DoctorDetails.findOne({ _id: appointment_details[i].doctor })
				let  user = await User.findOne({ _id: doctor._doctor_id })
				let patient = await User.findOne({ _id: appointment_details[i].patient })
				doctor_details.push(doctor)
				user_doctor.push(user)
				user_patient.push(patient)
			}

			req.appointment_details = appointment_details
			req.doctor_details = doctor_details
			req.user_doctor = user_doctor
			req.patient = user_patient

		}
		next()
	} catch (error) {
		req.error = error
	}
}


exports.previousAppointment = async (req, res, next) => {

	try {
		
		let appointment_details = await allAppointmentsOfUser(req)
		let doctor_details = await DoctorDetails.findOne({ _doctor_id: req.params.id })
		let date_today = new Date()
		let user_patient =[]
	
		for(let i = 0; i < appointment_details.length; ++i){
			let patient = await User.findOne({ _id: appointment_details[i].patient })
			user_patient.push(patient)
		}
		
		appointment_details.filter(appointment =>  appointment.date < date_today)
		req.appointment_details = appointment_details
		req.patient = user_patient
		req.doctor_details = doctor_details


		next()
	} catch (error) {
		req.error = error
	}

}


exports.editAppointment = async (req, res, next) => {

	try {

		let update = req.body
		
		await Appointment.findOneAndUpdate(
			{
				_id: update._id,
			},
			{
				$set: {
					appointment_summary: update.appointment_summary,
					end_time: update.end_time
				},
			},
			{ new: true }
		)
	
		next()
	} catch (error) {
		req.error = error
	}

}
