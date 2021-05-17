const jwt = require('jsonwebtoken')
const nodemailer = require('../js/nodemailer')
const Insurance = require('../models/insurance_model')
const user_controller = require('../controllers/user_controller')
exports.getInsurancePolicy = async (req, res, next) => {
	try {
		const {
			insurance_type,
			destination,
			first_name,
			last_name,
			email,
			ID,
			card_holder_name,
			card_holder_number,
			card_holder_card_expiredate,
			card_holder_card_security_code,
		} = req.body
		var daterange = req.body.daterange.replace(/\s+/g, '').split('-')
		const lowerCasedEmail = await user_controller.lowerCaseEmail(email)
		await paymentConfirmation(
			card_holder_name,
			card_holder_number,
			card_holder_card_expiredate,
			card_holder_card_security_code
		)
		const newInsurace = new Insurance({
			first_name,
			last_name,
			email: lowerCasedEmail,
			ID,
			insurance_type,
			destination,
			dates: {
				start_date: daterange[0],
				end_date: daterange[1],
			},
		})
		const insurance_reference = Array.from(Array(20), () =>
			Math.floor(Math.random() * 36).toString(36)
		).join('')
		newInsurace.insurance_reference = insurance_reference
		await newInsurace.save()
		nodemailer.sendConfirmationEmailInsurancePolicy(
			newInsurace.first_name,
			newInsurace.last_name,
			newInsurace.email,
			newInsurace.ID,
			newInsurace.insurance_type,
			newInsurace.dates,
			newInsurace.insurance_reference
		)
		req.error = 'Email Confirmation has been sent.'
		next()
	} catch (error) {
		next(error)
	}
}
async function paymentConfirmation(
	name,
	card_number,
	card_expiredate,
	card_securitycode
) {
	//No logic should be here because its a test website, and no need to require a payment.
	//dummy confirmantion
	return true
}
