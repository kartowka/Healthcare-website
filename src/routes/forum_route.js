const express = require('express')
const Forum = require('./../models/forum_model')
const User = require('./../models/user_model')
const router = express.Router()
const subForumRouter = require('./sub_forum_route')

router.get('/', async (req, res) => {
  const forum = await Forum.find().sort({ createdAt: 'desc' })
  res.render('forum_dir/forum', { forums: forum })
})

router.get('/new', (req, res) => {
  res.render('forum_dir/new', { forum: new Forum() })
})

router.get('/edit/:id', async (req, res) => {
  const forum = await Forum.findById(req.params.id)
  res.render('forum_dir/edit', { forum: forum })
})
router.post(
  '/',
  async (req, res, next) => {
    req.forum = new Forum()
    next()
  },
  saveforumAndRedirect('new')
)

router.put(
  '/:id',
  async (req, res, next) => {
    req.forum = await Forum.findById(req.params.id)
    next()
  },
  saveforumAndRedirect('edit')
)

router.delete('/:id', async (req, res) => {
  await Forum.findByIdAndDelete(req.params.id)
  res.redirect('/forum')
})

// ----------- SUBFORUM ------------ //
router.get('/:slug', async (req, res) => {
  const subForum = await Forum.findOne({ slug: req.params.slug })
  //subForum.question={topic:'1',question_body:'test',asked_by:subForum._id}
  //await Forum.findByIdAndUpdate(subForum._id,{$push:{question:{topic:'1',question_body:'test211',asked_by:subForum._id}}})
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
    subForumSlug: question.slug,
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
  const questions = forum.question.id(req.params.id)
  res.render('forum_dir/sub_forum_dir/edit_question', {
    forum: questions,
    subForumSlug: forum.slug,
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
  let forum = await Forum.findOne({ slug: req.params.slug })
  await Forum.updateOne({},{$pull: {question: { _id:req.params.id}}})
  res.redirect(`/forum/${req.params.slug}`) 
})
// ------------------------------------------------ //

function saveQuestionAndRedirect(path) {
  return async (req, res) => {
    let question = req.question
    let forum = req.forum
    let user = await User.findById(res.locals.loggedInUser._id)
    let full_name = user.first_name + ' ' + user.last_name
    try {
      if (path == 'new_question') {
        await Forum.findByIdAndUpdate(forum._id, {
          $push: {
            question: {
              topic: question.topic,
              question_body: question.question_body,
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
              'question.$.question_body': req.body.question_body,
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
function saveforumAndRedirect(path) {
  return async (req, res) => {
    let forum = req.forum
    forum.title = req.body.title
    forum.description = req.body.description
    forum.created_by = 'Dr.' + res.locals.loggedInUser.last_name
    forum._doctor_id = res.locals.loggedInUser._id
    try {
      forum = await forum.save()
      res.redirect(`/forum/${forum.slug}`)
    } catch (e) {
      res.render(`forum_dir/${path}`, { forum: forum })
    }
  }
}

module.exports = router
