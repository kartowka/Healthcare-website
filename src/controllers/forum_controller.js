const User = require('../models/user_model')
const nodemailer = require('../js/nodemailer')
const Forum = require('../models/forum_model')
const { roles } = require('../roles/roles')

exports.grantForumAccess = function (action, resource) {
  return async (req, res, next) => {
    try {
      if (resource == 'edit_question') {
        let forum = await Forum.findOne({slug:req.params.slug})
        let question = forum.question.id(req.params.id)
        if (String(req.user._id) !== String(question.asked_by_id) && req.user.role == 'patient') {
          throw new Error('You are not allowed to perform this action.')
        }
      }
      if (resource == 'edit_comment') {
        let forum = await Forum.findOne({slug:req.params.slug})
        let question = forum.question.id(req.params.questionID)
        let comment = question.comment.id(req.params.commentID)
        if (String(req.user._id) !== String(comment.commented_by_id) && req.user.role != 'admin') {
          throw new Error('You are not allowed to perform this action.')
        }
      }
      var permission = roles.can(req.user.role)[action](resource)
      if (!permission.granted) {
        throw new Error('You are not allowed to perform this action.')
      }
      next()
    } catch (error) {
      let statusCode = '401'
      res.redirect(`/restricted/${error}/${statusCode}`)
    }
  }
}

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
        forum.title
      )
      await Forum.updateOne(
        { _id: forum._id },
        { $set: { approved: 'Active' } }
      )
      throw 'Forum has been authorized.'
    }
  } catch (error) {
    req.error = { Message: error, statusCode: '200' }
    res.status(200)
    res.redirect(req.get('referer'))
    //TODO maybe delete
  }
}
