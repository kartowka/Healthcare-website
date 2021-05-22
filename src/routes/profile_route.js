const express = require('express')
const profile = express.Router()
const user_controller = require('../controllers/user_controller')
const appointment_management_controller = require('../controllers/appointment_management_controller')
const review_controllers = require('../controllers/review_controllers')
const url = require('url')

//pateint profile
profile
	.route('/patient_profile/:id')
	.get(
		user_controller.allowIfLoggedin,
		user_controller.grantAccess('readOwn', 'patient_profile'),
		user_controller.getUser,
		appointment_management_controller.getAppointments,
		(req, res) => {
			res.render('patient_profile', {
				data: req.user,
				appointment_details: req.appointment_details,
				doctor_details: req.doctor_details,
				user_doctor: req.user_doctor,
			})
		}
	)

//settings patient profile
profile
	.route('/patient_profile/patient_settings/:id')
	.get(
		user_controller.allowIfLoggedin,
		user_controller.grantAccess('readOwn', 'patient_settings'), //check
		user_controller.getUser,
		(req, res) => {
			res.render('patient_settings', {
				data: req.user,
				alert: req.query.Message,
			})
		}
	)
	.post(
		user_controller.allowIfLoggedin,
		user_controller.grantAccess('updateOwn', 'patient_settings'),
		user_controller.updateUser,
		(req, res) => {
			res.redirect(
				url.format({
					pathname: `/patient_profile/patient_settings/${req.params.id}`,
					query: {
						Message: req.error,
					},
				})
			)
		}
	)

profile
	.route('/patient_profile/patient_previous_appointments/:id')
	.get(
		user_controller.allowIfLoggedin,
		user_controller.grantAccess('readOwn', 'patient_previous_appointments'),
		user_controller.getUser,
		appointment_management_controller.getAppointments,
		(req, res) => {
			res.render('patient_previous_appointments', { 
				data: req.user,
				appointment_details: req.appointment_details,
				doctor_details: req.doctor_details,
				user_doctor: req.user_doctor,
				alert: req.query.Message,
			})
		}
	)
	.post(
		user_controller.allowIfLoggedin,
		review_controllers.new_review,
		(req, res) => {
			res.redirect(
				url.format({
					pathname: `/patient_profile/patient_previous_appointments/${req.params.id}`,
					query: {
						Message: req.error,
					},
				})
			)
		}
	)

//previous and future appointments
profile
	.route('/patient_profile/patient_future_appointments/:id')
	.get(
		user_controller.allowIfLoggedin,
		user_controller.grantAccess('readOwn', 'patient_future_appointments'),
		user_controller.getUser,
		appointment_management_controller.getAppointments,
		(req, res) => {
			res.render('patient_future_appointments', {
				data: req.user,
				appointment_details: req.appointment_details,
				doctor_details: req.doctor_details,
				user_doctor: req.user_doctor,
			})
		}
	)

//doctor profile
profile
	.route('/doctor_profile/:id')
	.get(
		user_controller.allowIfLoggedin,
		user_controller.grantAccess('readAny', 'doctor_profile'),
		user_controller.getUser,
		review_controllers.get_review,
		(req, res) => {
			res.render('doctor_profile', {
				data: req.user,
				doctor_details: req.doctor_details,
				user: res.locals.loggedInUser,
				review_details: req.review_details,
				average_rating: req.average_rating,
			})
		}
	)


//doctor settings
profile
	.route('/doctor_profile/doctor_settings/:id')
	.get(
		user_controller.allowIfLoggedin,
		user_controller.grantAccess('readOwn', 'doctor_settings'),
		user_controller.getUser,
		(req, res) => {
			res.render('doctor_settings', {
				data: req.user,
				doctor_details: req.doctor_details,
				alert: req.query.Message,
			})
		}
	)
	.post(
		user_controller.allowIfLoggedin,
		user_controller.grantAccess('updateOwn', 'doctor_settings'),
		user_controller.updateUser,
		(req, res) => {
			res.redirect(
				url.format({
					pathname: `/doctor_profile/doctor_settings/${req.params.id}`,
					query: {
						Message: req.error,
					},
				})
			)
		}
	)

//previous and future appointments
profile
	.route('/doctor_profile/doctor_future_appointments/:id')
	.get(
		user_controller.allowIfLoggedin,
		user_controller.grantAccess('readOwn', 'doctor_future_appointments'),
		user_controller.getUser,
		appointment_management_controller.getAppointments,
		(req, res) => {
			res.render('doctor_future_appointments', {
				data: req.user,
				appointment_details: req.appointment_details,
				doctor_details: req.doctor_details,
				user_patient : req.patient,
			})
		}
	)

profile
	.route('/doctor_profile/doctor_previous_appointments/:id')
	.get(
		user_controller.allowIfLoggedin,
		user_controller.grantAccess('readOwn', 'doctor_previous_appointments'),
		user_controller.getUser,
		(req, res) => {
			res.render('doctor_previous_appointments', { data: req.user })
		}
	)

// doctor Appointment summary
profile
	.route('/doctor_profile/doctor_appointment_summary/:id')
	.get(
		user_controller.allowIfLoggedin,
		user_controller.grantAccess('readOwn', 'doctor_appointment_summary'),
		user_controller.getUser,
		appointment_management_controller.previousAppointment,
		(req, res) => {
			res.render('doctor_appointment_summary', { 
				data: req.user,
				appointment_details: req.appointment_details,
				doctor_details: req.doctor_details,
				user_patient : req.patient,
				alert: req.query.Message,
			})
		}
	)
	.post(
		user_controller.allowIfLoggedin,
		appointment_management_controller.editAppointment,
		(req, res) => {
			res.redirect(
				url.format({
					pathname: `/doctor_profile/doctor_appointment_summary/${req.params.id}`,
					query: {
						Message: req.error,
					},
				})
			)
		}
	)

	
// doctor Reviwe
profile
	.route('/doctor_profile/doctor_Review/:id')
	.get(
		user_controller.allowIfLoggedin,
		user_controller.grantAccess('readOwn', 'doctor_Review'),
		user_controller.getUser,
		review_controllers.get_review,
		(req, res) => {
			res.render('doctor_Review', {
				data: req.user,
				review_details: req.review_details,
				average_rating: req.average_rating,
			})
		}
	)


// Make an Appointment
profile
	.route('/appointment_management/:id')
	.get(
		user_controller.allowIfLoggedin,
		user_controller.grantAccess('updateOwn', 'appointment_management'),
		user_controller.getUser,
		(req, res) => {
			res.render('appointment_management', {
				data: req.user,
				doctor_details: req.doctor_details,
				patient: res.locals.loggedInUser,
				alert: req.query.Message,
			})
		}
	)
	.post(
		user_controller.allowIfLoggedin,
		appointment_management_controller.make_an_Appointment,
		(req, res) => {
			res.redirect(
				url.format({
					pathname: `/appointment_management/${req.params.id}`,
					query: {
						Message: req.error,
					},
				})
			)
		}
	)

module.exports = profile
