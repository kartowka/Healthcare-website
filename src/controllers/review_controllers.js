const User = require('../models/user_model')
const DoctorDetails = require('../models/doctor_model')
const Review = require('../models/doctor_review_model')


exports.new_review = async (req, res, next) => {
	try {

		let review_details = req.body
		let doctorUser = await User.findOne({ _id: req.params.id })
		let patient = await User.findOne({ _id: res.locals.loggedInUser._id })

		const newReview = new Review({
	
            reviewer_name: review_details.name,
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
	}
}

exports.get_review = async (req, res, next) => {
	try {

        let review_details = await Review.find({ doctor: req.params.id })
        review_details.rating

        let average_rating = 0

        for(let i =0; i< review_details.length; ++i){
            
            average_rating+=review_details[i].rating

        }
        
        average_rating = average_rating / review_details.length



        req.review_details = review_details
        req.average_rating = average_rating

		next()
	} catch (error) {
		req.error = error
	}
}
