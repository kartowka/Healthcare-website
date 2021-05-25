const User = require('../models/user_model')
const User_doctor=require('../models/doctor_model')
const Msg = require('../models/sending_messages_model')
const e = require('express')
const { roles } = require('../roles/roles')


exports.sendMsg = async (req, res, next) =>
{
    try {
		let msg_details = req.body

	
		const newMsg = new Msg({
	
            to: req.params.id,
            from: res.locals.loggedInUser._id,
            message:msg_details.message,
            date: new Date(),
          

		})
		await newMsg.save()

        throw 'A new Msg has been created.'
		
	} catch (error) {
		req.error = error
        next()
	}

}

exports.getMsg = async (req, res, next) => 
{
	try{
		let msg = []
		msg = await Msg.find({ to: req.params.id })
		req.msg = msg
		next()

	}
	catch (error) {
		req.error = error
	}

}
	// try {
	// 	const userId = req.params.id
	// 	const user = await User.findById(userId)
	// 	if (!user) {
	// 		throw new Error('User does not exist')
	// 	}
		
	// 	let msg_details = []

	// 	if(user.role == )
    //     {
	// 		msg_details = await Msg.find({ to: userId })
			
	// 	} 
	// 	else if(user.role == 'doctor')

				
	// } catch (error) {
	// 	req.error = error
	// }




