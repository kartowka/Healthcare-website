const User = require('../models/user_model')
const DoctorDetails = require('../models/doctor_model')
const Review = require('../models/doctor_review_model')


exports.new_review = async (req, res, next) => {
	try {

		let review_details = req.body
		let doctorUser = await User.findOne({ _id: req.params.id })
		let patient = await User.findOne({ _id: res.locals.loggedInUser._id })

		const newReview = new Review({
	
            subject: review_details.subject,
            review: review_details.review,
            date: new Date(),
            rating: review_details.rating,
            reviewer_by: patient._id,
            doctor: doctorUser

		})
		await newReview.save()
		next()
	} catch (error) {
		req.error = error
        console.log(error)
	}
}
