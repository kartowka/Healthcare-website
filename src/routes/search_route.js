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
				const { sort_by, term } = req.query
				const users = await User.find({
					last_name: { $regex: term, $options: 'i' },
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
				if (sort_by != '') sortBy(sort_by, doctors)
				res.render('search', { doctors: doctors })
			} catch (e) {
				//console.log(e)
				res.render('search', { doctors: '' })
			}
		}
	)

function sortBy(sort_by, doctors) {
	if (sort_by == 'working_days') {
		let days = { Sunday: '0', Monday: '1', Tuesday: '2', Wednsday: '3', Thursday: '4', Friday: '5', Saturday: '6' }
		doctors.sort((first, second) => {
			first = days[first[sort_by][0]]
			second = days[second[sort_by][0]]
			return first < second ? 0 : 1
		})
	}
	else if (sort_by == 'spoken_languages'){
		console.log(doctors)
		doctors.sort((first, second) => {
			console.log(first)
			first = first[sort_by][0].toUpperCase()
			second = second[sort_by][0].toUpperCase()
			return first < second ? 0 : 1
		})
	}
	else doctors.sort((first, second) => {
		var first_parm = first[sort_by].toUpperCase()
		var second_parm = second[sort_by].toUpperCase()
		if (first_parm < second_parm) return -1
		if (first_parm > second_parm) return 1
		return 0
	})
}
module.exports = router