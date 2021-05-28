const Msg = require('../models/sending_messages_model')

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