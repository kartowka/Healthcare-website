const express = require('express')
const Forum = require('./../models/forum_model')
const User = require('./../models/user_model')
const user_controller = require('../controllers/user_controller')
const slugify = require('slugify')
const router = express.Router()

//!----------- FORUM ------------ //

router.get('/', user_controller.allowIfLoggedin, async (req, res) => {
  const forum = await Forum.find().sort({ createdAt: 'desc' })
  res.render('forum_dir/forum', { forums: forum })
})

router.get('/new_forum', (req, res) => {
  res.render('forum_dir/new_forum', { forum: new Forum(), button: 'new' })
})

router.get('/edit_forum/:id', async (req, res) => {
  const forum = await Forum.findById(req.params.id)
  res.render('forum_dir/edit_forum', { forum: forum, button: 'edit' })
})
router.post(
  '/',
  async (req, res, next) => {
    req.forum = new Forum()
    next()
  },
  saveforumAndRedirect('new_forum')
)

router.put(
  '/:id',
  async (req, res, next) => {
    req.forum = await Forum.findById(req.params.id)
    next()
  },
  saveforumAndRedirect('edit_forum')
)

router.delete('/:id', async (req, res) => {
  await Forum.findByIdAndDelete(req.params.id)
  res.redirect('/forum')
})

function saveforumAndRedirect(path) {
  return async (req, res) => {
    let forum = req.forum
    forum.title = req.body.title
    forum.description = req.body.description
    forum.created_by = res.locals.loggedInUser.first_name + ' ' + res.locals.loggedInUser.last_name
    forum._doctor_id = res.locals.loggedInUser._id
    forum.slug = slugify(forum.title, { lower: true, strict: true })
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
      res.render(`forum_dir/${path}`, { forum: forum })
    }
  }
}

//! ------------------ END OF FORUM MAIN PAGE SECTION ------------------------------ //

//!----------- QUESTIONS ------------ //
router.get('/:slug', async (req, res) => {
  const subForum = await Forum.findOne({ slug: req.params.slug })
  if (subForum == null) res.redirect('/forum')
  res.render('forum_dir/sub_forum_dir/sub_forum', {
    questions: subForum.question,
    subForumName: subForum.title,
    subForumSlug: subForum.slug,
  })
})

router.get('/:slug/new_question', async (req, res) => {
  const question = await Forum.findOne({ slug: req.params.slug })
  res.render('forum_dir/sub_forum_dir/new_question', {
    question: '',
    subForumSlug: question.slug,
    button: 'create',
  })
})
router.post(
  '/:slug',
  async (req, res, next) => {
    const question = await Forum.findOne({ slug: req.params.slug })
    req.question = req.body
    req.forum = question
    next()
  },
  saveQuestionAndRedirect('new_question')
)
router.get('/:slug/edit/:id', async (req, res) => {
  let forum = await Forum.findOne({ slug: req.params.slug })
  const question = forum.question.id(req.params.id)
  res.render('forum_dir/sub_forum_dir/edit_question', {
    question: question,
    subForumSlug: forum.slug,
    button: 'edit',
  })
})
router.put(
  '/:slug/:id',
  async (req, res, next) => {
    let forum = await Forum.findOne({ slug: req.params.slug })
    req.forum = forum
    req.questionID = req.params.id
    next()
  },
  saveQuestionAndRedirect('edit_question')
)
router.delete('/:slug/:id', async (req, res) => {
  await Forum.updateOne({}, { $pull: { question: { _id: req.params.id } } })
  res.redirect(`/forum/${req.params.slug}`)
})

function saveQuestionAndRedirect(path) {
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
        await Forum.findOneAndUpdate(
          { 'question._id': req.questionID },
          {
            $set: {
              'question.$.topic': req.body.topic,
              'question.$.asked_by_id': user._id,
              'question.$.asked_by': full_name,
            },
          },
          { new: true }
        )
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

//! ------------------ END OF QUESTION SECTION ------------------------------ //

// !---------- COMMENTS ----------------//

router.get('/:slug/:id', async (req, res) => {
  let forum = await Forum.findOne({ slug: req.params.slug })
  const question = forum.question.id(req.params.id)
  const comments = question.comment
  res.render('forum_dir/sub_forum_dir/conversation', {
    question: question,
    subForumSlug: req.params.slug,
    comments: comments,
  })
})

router.get('/:slug/:id/new_comment', async (req, res) => {
  const forum = await Forum.findOne({ slug: req.params.slug })
  res.render('forum_dir/sub_forum_dir/new_comment', {
    comment: '',
    subForumSlug: forum.slug,
    question: req.params.id,
    button: 'create',
  })
})
router.post(
  '/:slug/:id',
  async (req, res, next) => {
    const forum = await Forum.findOne({ slug: req.params.slug })
    req.comment = req.body
    req.forum = forum
    req.questionID = req.params.id
    next()
  },
  saveCommentAndRedirect('new_comment')
)

router.get('/:slug/:questionID/edit/:commentID', async (req, res) => {
  let forum = await Forum.findOne({ slug: req.params.slug })
  let question = forum.question.id(req.params.questionID)
  let comment = question.comment.id(req.params.commentID)
  res.render('forum_dir/sub_forum_dir/edit_comment', {
    comment: comment.comment_body,
    question: req.params.questionID,
    subForumSlug: forum.slug,
    commentID: req.params.commentID,
    button: 'edit',
  })
})
router.put(
  '/:slug/:questionID/:commentID',
  async (req, res, next) => {
    let forum = await Forum.findOne({ slug: req.params.slug })
    req.forum = forum
    req.questionID = req.params.questionID
    req.commentID = req.params.commentID
    req.comment = req.body
    next()
  },
  saveCommentAndRedirect('edit_comment')
)
router.delete('/:slug/:questionID/:commentID', async (req, res) => {
  let forum = await Forum.findOne({ slug: req.params.slug })
  let questionID = req.params.questionID
  await Forum.findByIdAndUpdate(
    forum._id,
    {
      $pull: {
        'question.$[i].comment': { _id: req.params.commentID }, //[i] == questionID
      },
    },
    {
      arrayFilters: [
        {
          'i._id': req.params.questionID,
        },
      ],
    }
  )
  res.redirect(`/forum/${req.params.slug}/${questionID}`)
})

function saveCommentAndRedirect(path) {
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
          forum._id,
          {
            $push: {
              'question.$[i].comment': {
                //[i] == question._id
                comment_body: comment.comment_body,
                commented_by: full_name,
                commented_by_id: user._id,
              },
            },
          },
          {
            arrayFilters: [
              {
                'i._id': question._id,
              },
            ],
          }
        )
      }
      if (path == 'edit_comment') {
        await Forum.findByIdAndUpdate(
          forum._id,
          {
            $set: {
              'question.$[i].comment.$[j]': {
                //[i] == question.ID, [j] == comment.ID
                comment_body: comment.comment_body,
                commented_by: full_name,
                commented_by_id: user._id,
              },
            },
          },
          {
            arrayFilters: [
              {
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
      console.log(e)
      res.render(`forum_dir/sub_forum_dir/${path}`, {
        subForumSlug: req.params.slug,
        question: req.params.questionID,
        commentID: req.params.commentID,
      })
    }
  }
}
//! ------------------ END OF COMMENT SECTION ------------------------------ //

module.exports = router
