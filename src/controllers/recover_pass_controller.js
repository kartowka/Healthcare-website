const User = require('../models/user_model')
const jwt = require('jsonwebtoken')
const nodemailer = require('../js/nodemailer')
const user_controller = require('../controllers/user_controller')

exports.forgotPassword = async (req, res, next) => {
	const { email } = req.body
	const user = await User.findOne({ email })
		.then((user) => {
			if (!user) {
				throw 'User not found'
			}
			const accessToken = jwt.sign(
				{ userId: user._id },
				process.env.JWT_SECRET,
				{ expiresIn: '20m' }
			)
			nodemailer.sendResetPassword(
				user.first_name,
				user.last_name,
				user.email,
				accessToken
			)
			res.redirect('/')
			user.save((err) => {
				if (err) {
					let statusCode = '401'
					res.redirect(`/restricted/${err}/${statusCode}`)
				}
			})
		})
		.catch((error) => {
			let statusCode = '401'
			res.redirect(`/restricted/${error}/${statusCode}`)
		})
}
exports.passwordReset = async (req, res, next) => {
	try {
		const { accessToken } = req.params
		if (accessToken) {
			const verified = jwt.verify(accessToken, process.env.JWT_SECRET)
			if (verified) {
				const { newPassword, confirmPassword } = req.body
				const user = await User.findById(verified.userId)
				if (newPassword === confirmPassword) {
					const hashedPassword = await user_controller.hashPassword(newPassword)
					await User.updateOne(
						{ _id: user._id },
						{ $set: { password: hashedPassword } },
						{ new: true }
					)
					throw 'Password changed successfully'
				} else {
					throw 'Confirm password does not match'
				}
			} else {
				throw 'Invalid accessToken'
			}
		} else {
			throw 'accessToken not found'
		}
	} catch (error) {
		if (error == 'Invalid accessToken' || error == 'accessToken not found') {
			let statusCode = '401'
			res.redirect(`/restricted/${error}/${statusCode}`)
		}
		req.error = error
		next()
	}
}
