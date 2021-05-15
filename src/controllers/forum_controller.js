const User = require('../models/user_model')
const nodemailer = require('../js/nodemailer')
const Forum = require('../models/forum_model')
const {
  roles
} = require('../roles/roles')
const slugify = require('slugify')


exports.grantForumAccess = function (action, resource) {
  return async (req, res, next) => {
    try {
      if (resource == 'edit_question') {
        let forum = await Forum.findOne({
          slug: req.params.slug
        })
        let question = forum.question.id(req.params.id)
        if (String(req.user._id) !== String(question.asked_by_id) && req.user.role == 'patient') {
          throw new Error('You are not allowed to perform this action.')
        }
      }
      if (resource == 'edit_comment') {
        let forum = await Forum.findOne({
          slug: req.params.slug
        })
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
    const forum = await Forum.findOne({
      _id: req.body.auth_forum
    })
    const user = await User.findById(forum._doctor_id)
    if (forum) {
      nodemailer.sendConfirmationEmailForumAuth(
        user.email,
        forum.created_by,
        forum.title
      )
      await Forum.updateOne({
        _id: forum._id
      }, {
        $set: {
          approved: 'Active'
        }
      })
      throw 'Forum has been authorized.'
    }
  } catch (error) {
    req.error = {
      Message: error,
      statusCode: '200'
    }
    res.status(200)
    res.redirect(req.get('referer'))
    //TODO maybe delete
  }
}
exports.saveforumAndRedirect = function (path) {
  return async (req, res) => {
    let forum = req.forum
    forum.title = req.body.title
    forum.description = req.body.description
    forum.created_by =
      res.locals.loggedInUser.first_name +
      ' ' +
      res.locals.loggedInUser.last_name
    forum._doctor_id = res.locals.loggedInUser._id
    forum.slug = slugify(forum.title, {
      lower: true,
      strict: true
    })
    if (res.locals.loggedInUser.role == 'doctor') {
      forum.created_by = 'Dr.' + ' ' + res.locals.loggedInUser.last_name
    }
    try {
      if (path == 'new_forum') forum = await forum.save()
      if (path == 'edit_forum') {
        await Forum.findByIdAndUpdate(forum._id, {
          $set: {
            title: forum.title,
            description: forum.description,
            slug: forum.slug,
          },
        })
      }
      res.redirect('/forum')
    } catch (e) {
      res.render(`forum_dir/${path}`, {
        forum: forum
      })
    }
  }
}
exports.saveQuestionAndRedirect = function (path) {
  return async (req, res) => {
    let question = req.question
    let forum = req.forum
    let user = await User.findById(res.locals.loggedInUser._id)
    let full_name = user.first_name + ' ' + user.last_name
    if (user.role == 'doctor') {
      full_name = 'Dr.' + ' ' + user.last_name
    }
    try {
      if (path == 'new_question') {
        await Forum.findByIdAndUpdate(forum._id, {
          $push: {
            question: {
              topic: question.topic,
              asked_by_id: user._id,
              asked_by: full_name,
            },
          },
        })
      }
      if (path == 'edit_question') {
        await Forum.findOneAndUpdate({
          'question._id': req.questionID
        }, {
          $set: {
            'question.$.topic': req.body.topic,
            'question.$.asked_by_id': user._id,
            'question.$.asked_by': full_name,
          },
        }, {
          new: true
        })
      }
      res.redirect(`/forum/${forum.slug}`)
    } catch (e) {
      res.render(`forum_dir/sub_forum_dir/${path}`, {
        subForumSlug: forum.slug,
        question: question,
      })
    }
  }
}
exports.saveCommentAndRedirect = function (path) {
  return async (req, res) => {
    let comment = req.comment
    let forum = req.forum
    const question = forum.question.id(req.params.id)
    let user = await User.findById(res.locals.loggedInUser._id)
    let full_name = user.first_name + ' ' + user.last_name
    if (user.role == 'doctor') {
      full_name = 'Dr.' + ' ' + user.last_name
    }
    try {
      if (path == 'new_comment') {
        await Forum.findByIdAndUpdate(
          forum._id, {
            $push: {
              'question.$[i].comment': {
                //[i] == question._id
                comment_body: comment.comment_body,
                commented_by: full_name,
                commented_by_id: user._id,
              },
            },
          }, {
            arrayFilters: [{
              'i._id': question._id,
            }, ],
          }
        )
      }
      if (path == 'edit_comment') {
        await Forum.findByIdAndUpdate(
          forum._id, {
            $set: {
              'question.$[i].comment.$[j]': {
                //[i] == question.ID, [j] == comment.ID
                comment_body: comment.comment_body,
                commented_by: full_name,
                commented_by_id: user._id,
              },
            },
          }, {
            arrayFilters: [{
                'i._id': req.params.questionID,
              },
              {
                'j._id': req.params.commentID,
              },
            ],
          }
        )
      }
      res.redirect(`/forum/${forum.slug}/${req.questionID}`)
    } catch (e) {
      res.render(`forum_dir/sub_forum_dir/${path}`, {
        subForumSlug: req.params.slug,
        question: req.params.questionID,
        commentID: req.params.commentID,
      })
    }
  }
}