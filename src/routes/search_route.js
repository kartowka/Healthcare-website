const express = require('express')
const router = express.Router()
const user_controller = require('../controllers/user_controller')
const User = require('../models/user_model')
const DoctorDetails = require('../models/doctor_model')

router
	.route('/')
	.get(
		user_controller.allowIfLoggedin,
		user_controller.getUsers,
		async (req, res) => {
			try {
				const { term } = req.query
				const users = await User.find({
					first_name: { $regex: term, $options: 'i' },
				})
					.where('role')
					.equals('doctor')
				var doctors = []
				for (let user of users) {
					let doctor_details = await DoctorDetails.findOne({
						_doctor_id: user._id,
					})
					let doctor = {
						first_name: user.first_name,
						last_name: user.last_name,
						city: doctor_details.clinic_address.city,
						specialization: doctor_details.specialization,
						working_days: doctor_details.working_days,
						spoken_languages: doctor_details.spoken_languages,
						doctor_related_clinics: doctor_details.doctor_related_clinics,
					}
					doctors.push(doctor)
				}
				res.render('search', { doctors: doctors })
			} catch (e) {
				console.log(e)
				res.render('search', { doctors: '' })
			}
		}
	)
module.exports = router
