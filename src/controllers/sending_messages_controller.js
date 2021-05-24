const User = require('../models/user_model')
const Msg = require('../models/sending_messages_model')
const e = require('express')


exports.sendMsg = async (req, res, next) =>
{
    try {
		let msg_details = req.body

        console.log('req.params.id')
        console.log(req.params.id)
        console.log('res.locals.loggedInUser._id')
        console.log(res.locals.loggedInUser._id)
        console.log('msg_details.message')
        console.log(msg_details.message)
	
		const newMsg = new Msg({
	
            to: req.params.id,
            from: res.locals.loggedInUser._id,
            message:msg_details.message,
            date: new Date(),
          

		})
		await newMsg.save()

        console.log('???????')
        
        throw 'A new Msg has been created.'
		
	} catch (error) {
		req.error = error
        next()
	}

}

exports.getMsg = async (req, res, next) => {
	const msg = await Msg.find({ to: req.params.id })
	req.params.msg = msg
	next()
}

