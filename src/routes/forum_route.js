const express = require('express')
const Forum = require('./../models/forum_model')
const router = express.Router()

router.get('/new', (req, res) => {
  res.render('forum/new', { forum: new Forum() })
})

router.get('/edit/:id', async (req, res) => {
  const forum = await Forum.findById(req.params.id)
  res.render('forum/edit', { forum: forum })
})

router.get('/:slug', async (req, res) => {
  const forum = await Forum.findOne({ slug: req.params.slug })
  if (forum == null) res.redirect('/forum')
  res.render('forum/show', { forum: forum })
})

router.post('/', async (req, res, next) => {
  req.forum = new Forum()
  next()
}, saveforumAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  req.forum = await Forum.findById(req.params.id)
  next()
}, saveforumAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await Forum.findByIdAndDelete(req.params.id)
  res.redirect('/forum')
})

function saveforumAndRedirect(path) {
  return async (req, res) => {
    let forum = req.forum
    forum.title = req.body.title
    forum.description = req.body.description
    //forum.markdown = req.body.markdown
    try {
      forum = await forum.save()
      res.redirect(`/forum/${forum.slug}`)
    } catch (e) {
      res.render(`forum/${path}`, { forum: forum })
    }
  }
}

module.exports = router