const mongoose = require('mongoose')
const Schema = mongoose.Schema
const slugify = require('slugify')

const commentSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  comment_body: {
    type: String,
    required: true,
  },
  commented_by: {
    type: String,
    required: true,
  },
  commented_by_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
})

const questionSchema = new Schema({
  topic: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  asked_by_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  asked_by: {
    type: String,
  },
  comment: {
    type: [commentSchema],
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
    
  },
  question: {
    type: [questionSchema],
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


