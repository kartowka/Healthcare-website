const express = require('express')
const router = express.Router()
const user_controller = require('../controllers/user_controller')
const User = require('../models/user_model')
const DoctorDetails = require('../models/doctor_model')

router.route('/').get(user_controller.allowIfLoggedin, async (req, res) => {
	try {
		var doctors = []
		const { term } = req.query
		await DoctorDetails.find({
			$text: { $search: term, $caseSensitive: false },
		})
			.then(async (users) => {
				for (let user in users) {
					let getUserFromDB = await User.findById(users[user]._doctor_id)
					let doctor = {
						first_name: getUserFromDB.first_name,
						last_name: getUserFromDB.last_name,
						city: users[user].clinic_address.city,
						specialization: users[user].specialization,
						working_days: users[user].working_days,
						spoken_languages: users[user].spoken_languages,
						doctor_related_clinics: users[user].doctor_related_clinics,
						_id: users[user]._doctor_id,
					}
					doctors.push(doctor)
				}
			})
			.catch((e) => {
				//console.log(e)
			})
		await User.find({ $text: { $search: term, $caseSensitive: false } })
			.where('role')
			.equals('doctor')
			.then(async (users) => {
				for (let user in users) {
					let getUserFromDB = await DoctorDetails.findOne({
						_doctor_id: users[user]._id,
					})
					let doctor = {
						first_name: users[user].first_name,
						last_name: users[user].last_name,
						city: getUserFromDB.clinic_address.city,
						specialization: getUserFromDB.specialization,
						working_days: getUserFromDB.working_days,
						spoken_languages: getUserFromDB.spoken_languages,
						doctor_related_clinics: getUserFromDB.doctor_related_clinics,
						_id: getUserFromDB._doctor_id,
					}
					doctors.push(doctor)
				}
			})
			.catch((e) => {
				//console.log(e)
			})
		res.render('search', { doctors: doctors })
	} catch (e) {
		res.render('search', { doctors: '' })
	}
})
module.exports = router
