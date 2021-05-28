const User = require('../models/user_model')
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
        throw 'A new Review has been created.'
		
	} catch (error) {
		req.error = error
        next()
	}
}

exports.get_review = async (req, res, next) => {
	try {
        
        let review_details = await Review.find({ doctor: req.params.id })
        let average_rating = 0
        let has_review = false

        

        for(let i =0; i< review_details.length; ++i){
            
            average_rating+=review_details[i].rating
            
            if( review_details[i].reviewer_by.toString() == res.locals.loggedInUser._id.toString() ){
                has_review = true
            }

        }
        if(average_rating > 0){
            average_rating = average_rating / review_details.length
        }
       
        req.review_details = review_details
        req.average_rating = average_rating
        req.has_review = has_review

		next()
	} catch (error) {
		req.error = error
        
	}
}