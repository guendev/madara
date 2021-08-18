const mongoose = require('mongoose')
const { autoIncrement } = require('mongoose-plugin-autoinc')
const slug = require('mongoose-slug-generator')

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  user: {
    type: Number,
    default: 0
  },
  otherTitle: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: ''
  },
  team: {
    type: String,
    default: '',
    index: true
  },
  slug: {
    type: String,
    slug: ['title']
  },
  avatar: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  badge: {
    type: String,
    default: '',
    index: true
  },
  adsense: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0,
    index: true
  },
  countChapter: {
    type: Number,
    default: 0,
    index: true
  },
  rating: {
    type: Number,
    default: 4.5,
    index: true
  },
  categories: {
    type: [Number],
    default: [],
    index: true
  },
  updatedAt: {
    type: Number,
    default: Date.now()
  },
  createdAt: {
    type: Number,
    default: Date.now()
  },
  source: {
    type: String,
    default: null,
    index: true
  }
})

BookSchema.plugin(autoIncrement, 'Story')
BookSchema.plugin(slug)
module.exports = mongoose.model('Story', BookSchema)
