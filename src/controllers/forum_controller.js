
const User = require('../models/user_model')
const nodemailer = require('../js/nodemailer')
const Forum = require('../models/forum_model')

exports.getForums = async (req, res, next) => {
    const forums = await Forum.find({})
    req.params.forums = forums
    next()
}

exports.authForum = async (req, res, next) => {
    try {
        const forum = await Forum.findOne({ _id: req.body.auth_forum })
        const user = await User.findById(forum._doctor_id)
        if (forum) {
            nodemailer.sendConfirmationEmailForumAuth(
                user.email,
                forum.created_by,
                forum.title,
            )
            await Forum.updateOne({ _id: forum._id }, { $set: { approved: 'Active' } })
            throw 'Forum has been authorized.'
        }
    } catch (error) {
        req.error = { Message: error, statusCode: '200' }
        res.status(200)
        res.redirect(req.get('referer'))
        //TODO maybe delete
    }
}