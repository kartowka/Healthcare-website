const User = require('../models/user_model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { roles } = require('../roles/roles')
const nodemailer = require('../js/nodemailer')
const DoctorDetails = require('../models/doctor_model')

exports.grantAccess = function (action, resource) {
	return async (req, res, next) => {
		try {
			var granted = true
			const user = await User.findById(req.params.id)
			if (
				req.user.id != user.id &&
				user.role == 'patient' &&
				req.user.role == 'patient'
			)
				granted = false
			else if (
				req.user.id != user.id &&
				user.role == 'doctor' &&
				req.user.role == 'doctor' &&
				resource != 'doctor_profile' && 
				resource != 'appointment_management'
			)
				granted = false
			var permission = roles.can(req.user.role)[action](resource)
			if (!permission.granted || !granted) {
				throw new Error('You are not allowed to perform this action.')
			}
			next()
		} catch (error) {
			let statusCode = '401'
			res.redirect(`/restricted/${error}/${statusCode}`)
		}
	}
}
exports.hashPassword = async (password) => {
	return await bcrypt.hash(password, 10)
}

async function validatePassword(plainPassword, hashedPassword) {
	return await bcrypt.compare(plainPassword, hashedPassword)
}

exports.lowerCaseEmail = async (email) => {
	return String(email).toLowerCase()
}

exports.signup = async (req, res, next) => {
	try {
		const {
			first_name,
			last_name,
			email,
			password,
			role,
			clinic,
			medical_license_id,
			doctor_related_clinics,
		} = req.body

		const hashedPassword = await this.hashPassword(password)
		const lowerCasedEmail = await this.lowerCaseEmail(email)
		const newUser = new User({
			first_name,
			last_name,
			email: lowerCasedEmail,
			password: hashedPassword,
			role: role || 'patient',
			clinic,
		})
		const accessToken = jwt.sign(
			{ userId: newUser._id },
			process.env.JWT_SECRET,
			{
				expiresIn: '1d',
			}
		)

		newUser.accessToken = accessToken
		newUser.save(async (err) => {
			var msg
			if (err) {
				if (
					await DoctorDetails.exists({ medical_license_id: medical_license_id })
				) {
					msg = 'User & License ID already exist in the database'
				} else {
					msg = 'User already exists in the database'
				}
				let error = msg
				let statusCode = '401'
				res.redirect(`/restricted/${error}/${statusCode}`)
			} else {
				if (newUser.role == 'doctor') {
					const doctor_details = new DoctorDetails({
						_doctor_id: newUser._id,
						medical_license_id,
						doctor_related_clinics,
					})
					await doctor_details.save()
				}
				nodemailer.sendConfirmationEmail(
					newUser.first_name,
					newUser.last_name,
					newUser.email,
					newUser.accessToken,
					newUser.role
				)
				req.error = 'Email confirmation has been sent.'
				res.status(200)
				next()
			}
		})
	} catch (error) {
		next()
	}
}

exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body
		const lowerCasedEmail = await this.lowerCaseEmail(email)
		const user = await User.findOne({ email: lowerCasedEmail })
		if (!user) {
			throw 'Email does not exists!'
		}
		const validPassword = await validatePassword(password, user.password)
		if (!validPassword) {
			throw 'Password is not correct.'
		}
		if (user.status != 'Active') {
			throw 'Pending Account. Please Verify Your Email!'
		}

		const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: '1d',
		})
		let options = {
			path: '/',
			sameSite: true,
			maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
			httpOnly: true, // The cookie only accessible by the web server
		}
		res.cookie('x-access-token', accessToken, options)
		await User.findByIdAndUpdate(user._id, { accessToken })
		if (user.role == 'patient') {
			res.redirect(`/patient_profile/${user._id}`)
		} else if (user.role == 'doctor') {
			res.redirect(`/doctor_profile/doctor_settings/${user._id}`)
		} else {
			res.redirect('/')
		}
	} catch (error) {
		req.error = error
		next()
	}
}

exports.getUsers = async (req, res, next) => {
	const users = await User.find({})
	req.params.users = users
	next()
}

exports.getUser = async (req, res, next) => {
	try {
		const userId = req.params.id
		const user = await User.findById(userId)
		if (user.role == 'doctor') {
			let details = await DoctorDetails.findOne({ _doctor_id: userId })
			req.doctor_details = details
		}
		if (!user) {
			throw new Error('User does not exist')
		}
		req.user = user
		next()
	} catch (error) {
		let statusCode = '401'
		res.redirect(`/restricted/${error}/${statusCode}`)
	}
}

exports.updateUser = async (req, res, next) => {
	try {
		let update = req.body
		let userId = req.params.id
		let user = await User.findById(userId)
		if (update.first_name != undefined) {
			if (update.first_name && update.last_name) {
				await User.findByIdAndUpdate(user, update)
				if (user.role == 'doctor') {
					let details = await DoctorDetails.findOne({ _doctor_id: userId })
					await DoctorDetails.findByIdAndUpdate(details._id, update)
				}
				throw `${user.first_name} ${user.last_name} has been updated`
			} else throw 'No updated, missing data in one of the fields'
		}

		if (user.role == 'doctor') {
			if (update.specialization != undefined)
				update.specialization = update.specialization.filter(
					(s) => s.trim() != ''
				)

			let details = await DoctorDetails.findOne({ _doctor_id: userId })
			if (update.working_days != undefined || update.bio != undefined) {
				await DoctorDetails.findByIdAndUpdate(details._id, update)
				throw `${user.first_name} ${user.last_name} has been updated`
			}

			if (update.start_time != undefined && update.end_time != undefined) {
				var start = update.start_time
				var end = update.end_time
				var dtStart = new Date('1.1.2000 ' + start)
				var dtEnd = new Date('1.1.2000 ' + end)
				var difference_in_milliseconds = dtEnd - dtStart
				if (difference_in_milliseconds < 0)
					throw 'start time should be less than end time.'
				await DoctorDetails.findByIdAndUpdate(details._id, update)
				throw `${user.first_name} ${user.last_name} has been updated`
			}

			if (update.city != undefined && update.street != undefined) {
				if (details.clinic_address != undefined) {
					await DoctorDetails.findOneAndUpdate(
						{
							_id: details._id,
							'clinic_address._id': details.clinic_address._id,
						},
						{
							$set: {
								'clinic_address.city': update.city,
								spoken_languages: update.spoken_languages,
								'clinic_address.street': update.street,
								clinic_phone_number: update.clinic_phone_number,
							},
						},
						{ new: true }
					)
				} else {
					await DoctorDetails.findByIdAndUpdate(
						details._id,
						{
							$set: {
								clinic_address: {
									city: update.city,
									street: update.street,
								},
							},
						},
						{ new: true }
					)
				}
				throw `${user.first_name} ${user.last_name} has been updated`
			}
			//else throw new Error('No updated, missing data in one of the fields')
		}
	} catch (error) {
		req.error = error
		next()
	}
}

exports.deleteUser = async (req, res) => {
	try {
		const userId = req.body.delete_ID
		const user = await User.findById(userId)
		if (user.role == 'doctor') {
			await DoctorDetails.findOneAndDelete({ _doctor_id: userId })
		}
		await User.findByIdAndDelete(userId)
		throw `${user.first_name} ${user.last_name} has been deleted`
	} catch (error) {
		req.error = error
	}
}

exports.allowIfLoggedin = async (req, res, next) => {
	try {
		const user = res.locals.loggedInUser
		if (!user) {
			throw new Error('You need to be logged in to access this route')
		}
		req.user = user
		next()
	} catch (error) {
		let statusCode = '401'
		res.redirect(`/restricted/${error}/${statusCode}`)
	}
}

exports.denyIfLoggedin = async (req, res, next) => {
	try {
		const user = res.locals.loggedInUser
		if (user) {
			throw new Error('You already loggedin.')
		} else {
			next()
		}
	} catch (error) {
		let statusCode = '401'
		res.redirect(`/restricted/${error}/${statusCode}`)
	}
}

exports.verifyUser = (req, res, next) => {
	User.findOne({ accessToken: req.params.confirmationCode })
		.then((user) => {
			if (!user) {
				throw new Error('User not found!')
			}

			if (user.role == 'doctor') {
				user.status = 'Waiting for Admin Approval'
			} else user.status = 'Active'
			res.redirect('/login')
			user.save((err) => {
				if (err) {
					res.status(500).send({ message: err })
					return
				}
			})
		})
		.catch((error) => {
			let statusCode = '401'
			res.redirect(`/restricted/${error}/${statusCode}`)
		})
}

exports.verifyDoctor = async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.body.approve_ID })
		if (user) {
			nodemailer.sendAuthenticationApprovalToDoctor(
				user.last_name,
				user.email,
				user._id
			)
		}
		await User.updateOne({ _id: user._id }, { $set: { status: 'Active' } })
		throw `${user.first_name} ${user.last_name} has been approved`
	} catch (error) {
		req.error = error
	}
}
