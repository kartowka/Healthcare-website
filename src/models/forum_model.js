const mongoose = require('mongoose')
const Schema = mongoose.Schema
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const questionSchema = new Schema({
  topic: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  question_body: {
    type: String,
    required: true,
  },
  asked_by_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  asked_by: {
    type: String,
  },
})

const commentSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  comment_body: {
    type: String,
    required: true,
  },
  commented_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
})

const forumSchema = new Schema({
  _doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  question: {
    type: [questionSchema],
  },
  comment: {
    type: [commentSchema],
  },
  created_by: {
    type: String,
  },
  approved: {
    type: String,
    enum: ['Pending', 'Active'],
    default: 'Pending',
  },
})
forumSchema.pre('validate', function (next) {
    if (this.title) {
      this.slug = slugify(this.title, { lower: true, strict: true })
    }
    next()
  })
const Forum = mongoose.model('forum', forumSchema)

module.exports = Forum


