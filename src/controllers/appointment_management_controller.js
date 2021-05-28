const User = require('../models/user_model')
const DoctorDetails = require('../models/doctor_model')
const Appointment = require('../models/appointment_model')

exports.make_an_Appointment = async (req, res, next) => {
	try {

		let appointment_details = req.body
		let appointment_date = new Date(req.body.date + 'Z')
		let minutes = appointment_date.getUTCMinutes()
		let hours = appointment_date.getUTCHours()
		let doctor = await DoctorDetails.findOne({ _doctor_id: req.params.id })
		let appointment_details_list = await Appointment.find({ doctor: doctor._id })
		let start_time = doctor.start_time.split(':')
		let end_time = doctor.end_time.split(':')

		let day_of_week = {
			0: 'Sunday',
			1: 'Monday',
			2: 'Tuesday',
			3: 'Wednesday',
			4: 'Thursday',
			5: 'Friday',
			6: 'Saturday',
		}

		// Add 0 if the number is one digit, to get format: hh:mm
		if (minutes < 10) {
			minutes = '0' + minutes
		}
		if (hours < 10) {
			hours = '0' + hours
		}


		if (doctor._doctor_id == res.locals.loggedInUser._id) {
			throw 'A doctor cannot make an appointment for himself!'
		}

		// Check if the date has passed
		if (new Date() > appointment_date) {
			throw 'An appointment cannot be scheduled on this date'
		}


		//Check according to the doctor's working hours
		if (!doctor.working_days.includes(day_of_week[appointment_date.getDay()])) {
			throw 'Please select another date, please select a date that the doctor works'
		}

		//Check according to the doctor's working days
		if (hours == start_time[0] && minutes < start_time[1]
			|| !(start_time[0] <= hours && hours <= end_time[0])
			|| hours == end_time[0] && minutes > end_time[1]
		) {
			throw 'Please select another time, please select a date that the doctor works'
		}


		// Check that no appointment is scheduled for the selected date.
		for (let i = 0; i < appointment_details_list.length; ++i) {

			if (appointment_details_list[i].date.toString() === appointment_date.toString()) {
				throw 'Please select another date, the time you selected is no longer available.'
			}

		}

		const newAppointment = new Appointment({
			start_time: hours + ':' + minutes,
			date: appointment_date,
			appointment_subject: appointment_details.appointment_subject,
			doctor: doctor._id,
			patient: res.locals.loggedInUser._id,
			type: appointment_details.type,
		})
		await newAppointment.save()
		throw 'A new appointment has been scheduled.'


	} catch (error) {
		req.error = error
		next()

	}
}

async function allAppointmentsOfUser(req) {

	try {
		const userId = req.params.id
		const user = await User.findById(userId)
		if (!user) {
			throw new Error('User does not exist')
		}

		let appointment_details = []

		if (user.role == 'patient') {
			appointment_details = await Appointment.find({ patient: userId })

		}
		else if (user.role == 'doctor') {
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


		if (appointment_details != []) {

			let doctor_appintment_details = []
			let user_doctor = []
			let user_patient = []
			let has_appointment = false

			for (let i = 0; i < appointment_details.length; ++i) {
				let doctor = await DoctorDetails.findOne({ _id: appointment_details[i].doctor })
				let user = await User.findOne({ _id: doctor._doctor_id })
				let patient = await User.findOne({ _id: appointment_details[i].patient })

				if (appointment_details[i].patient.toString() == res.locals.loggedInUser._id.toString()) {
					has_appointment = true
				}
				doctor_appintment_details.push(doctor)
				user_doctor.push(user)
				user_patient.push(patient)
			}

			req.appointment_details = appointment_details
			req.doctor_appintment_details = doctor_appintment_details
			req.user_doctor = user_doctor
			req.patient = user_patient
			req.has_appointment = has_appointment

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
		let user_patient = []

		for (let i = 0; i < appointment_details.length; ++i) {
			let patient = await User.findOne({ _id: appointment_details[i].patient })
			user_patient.push(patient)
		}

		appointment_details.filter(appointment => appointment.date < date_today)
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

		throw 'The appointment details has been updated.'

	} catch (error) {
		req.error = error
		next()

	}
}
