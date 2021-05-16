const express = require('express')
const Forum = require('./../models/forum_model')
const User = require('./../models/user_model')
const user_controller = require('../controllers/user_controller')
const router = express.Router()
const forum_controller = require('../controllers/forum_controller')

//*----------- FORUM ------------ //

router.get(
  '/',
  user_controller.allowIfLoggedin,
  forum_controller.grantForumAccess('readAny', 'forum'),
  async (req, res) => {
    const forum = await Forum.find().sort({
      createdAt: 'desc'
    })
    res.render('forum_dir/forum', {
      forums: forum
    })
  }
)
router.get(
  '/new_forum',
  user_controller.allowIfLoggedin,
  forum_controller.grantForumAccess('readOwn', 'new_forum'),
  (req, res) => {
    res.render('forum_dir/new_forum', {
      forum: new Forum(),
      button: 'new'
    })
  }
)

router.get(
  '/edit_forum/:forumID',
  user_controller.allowIfLoggedin,
  forum_controller.grantForumAccess('readOwn', 'edit_forum'),
  async (req, res) => {
    const forum = await Forum.findById(req.params.forumID)
    res.render('forum_dir/edit_forum', {
      forum: forum,
      button: 'edit'
    })
  }
)
router.post(
  '/',
  async (req, res, next) => {
      req.forum = new Forum()
      next()
    },
    forum_controller.saveforumAndRedirect('new_forum')
)

router.put(
  '/:id',
  async (req, res, next) => {
      req.forum = await Forum.findById(req.params.id)
      next()
    },
    forum_controller.saveforumAndRedirect('edit_forum')
)

router.delete('/:id', async (req, res) => {
  await Forum.findByIdAndDelete(req.params.id)
  res.redirect('/forum')
})



//*------------------ END OF FORUM MAIN PAGE SECTION ------------------------------ //

//*----------- QUESTIONS ------------ //

router.get(
  '/:slug',
  user_controller.allowIfLoggedin,
  forum_controller.grantForumAccess('readAny', 'sub_forum'),
  async (req, res) => {
    const subForum = await Forum.findOne({
      slug: req.params.slug
    })
    if (subForum == null) res.redirect('/forum')
    res.render('forum_dir/sub_forum_dir/sub_forum', {
      questions: subForum.question,
      subForumName: subForum.title,
      subForumSlug: subForum.slug,
    })
  }
)

router.get(
  '/:slug/new_question',
  user_controller.allowIfLoggedin,
  forum_controller.grantForumAccess('readOwn', 'new_question'),
  async (req, res) => {
    const question = await Forum.findOne({
      slug: req.params.slug
    })
    res.render('forum_dir/sub_forum_dir/new_question', {
      question: '',
      subForumSlug: question.slug,
      button: 'create',
    })
  }
)
router.post(
  '/:slug',
  async (req, res, next) => {
      const question = await Forum.findOne({
        slug: req.params.slug
      })
      req.question = req.body
      req.forum = question
      next()
    },
    forum_controller.saveQuestionAndRedirect('new_question')
)
router.get(
  '/:slug/edit/:id',
  user_controller.allowIfLoggedin,
  forum_controller.grantForumAccess('readOwn', 'edit_question'),
  async (req, res) => {
    let forum = await Forum.findOne({
      slug: req.params.slug
    })
    const question = forum.question.id(req.params.id)
    res.render('forum_dir/sub_forum_dir/edit_question', {
      question: question,
      subForumSlug: forum.slug,
      button: 'edit',
    })
  }
)
router.put(
  '/:slug/:id',
  async (req, res, next) => {
      let forum = await Forum.findOne({
        slug: req.params.slug
      })
      req.forum = forum
      req.questionID = req.params.id
      next()
    },
    forum_controller.saveQuestionAndRedirect('edit_question')
)
router.delete('/:slug/:id', async (req, res) => {
  await Forum.updateOne({}, {
    $pull: {
      question: {
        _id: req.params.id
      }
    }
  })
  res.redirect(`/forum/${req.params.slug}`)
})



//* ------------------ END OF QUESTION SECTION ------------------------------ //

// *---------- COMMENTS ----------------//

router.get(
  '/:slug/:id',
  user_controller.allowIfLoggedin,
  forum_controller.grantForumAccess('readOwn', 'conversation'),
  async (req, res) => {
    let forum = await Forum.findOne({
      slug: req.params.slug
    })
    const question = forum.question.id(req.params.id)
    const comments = question.comment
    res.render('forum_dir/sub_forum_dir/conversation', {
      question: question,
      subForumSlug: req.params.slug,
      comments: comments,
    })
  }
)

router.get(
  '/:slug/:id/new_comment',
  user_controller.allowIfLoggedin,
  forum_controller.grantForumAccess('readOwn', 'new_comment'),
  async (req, res) => {
    const forum = await Forum.findOne({
      slug: req.params.slug
    })
    res.render('forum_dir/sub_forum_dir/new_comment', {
      comment: '',
      subForumSlug: forum.slug,
      question: req.params.id,
      button: 'create',
    })
  }
)
router.post(
  '/:slug/:id',
  async (req, res, next) => {
      const forum = await Forum.findOne({
        slug: req.params.slug
      })
      req.comment = req.body
      req.forum = forum
      req.questionID = req.params.id
      next()
    },
    forum_controller.saveCommentAndRedirect('new_comment')
)

router.get(
  '/:slug/:questionID/edit/:commentID',
  user_controller.allowIfLoggedin,
  forum_controller.grantForumAccess('readOwn', 'edit_comment'),
  async (req, res) => {
    let forum = await Forum.findOne({
      slug: req.params.slug
    })
    let question = forum.question.id(req.params.questionID)
    let comment = question.comment.id(req.params.commentID)
    res.render('forum_dir/sub_forum_dir/edit_comment', {
      comment: comment.comment_body,
      question: req.params.questionID,
      subForumSlug: forum.slug,
      commentID: req.params.commentID,
      button: 'edit',
    })
  }
)
router.put(
  '/:slug/:questionID/:commentID',
  async (req, res, next) => {
      let forum = await Forum.findOne({
        slug: req.params.slug
      })
      req.forum = forum
      req.questionID = req.params.questionID
      req.commentID = req.params.commentID
      req.comment = req.body
      next()
    },
    forum_controller.saveCommentAndRedirect('edit_comment')
)
router.delete('/:slug/:questionID/:commentID', async (req, res) => {
  let forum = await Forum.findOne({
    slug: req.params.slug
  })
  let questionID = req.params.questionID
  await Forum.findByIdAndUpdate(
    forum._id, {
      $pull: {
        'question.$[i].comment': {
          _id: req.params.commentID
        }, //[i] == questionID
      },
    }, {
      arrayFilters: [{
        'i._id': req.params.questionID,
      }, ],
    }
  )
  res.redirect(`/forum/${req.params.slug}/${questionID}`)
})


//* ------------------ END OF COMMENT SECTION ------------------------------ //

module.exports = router