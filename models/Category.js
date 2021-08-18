const mongoose = require('mongoose')

const { autoIncrement } = require('mongoose-plugin-autoinc')
const slug = require('mongoose-slug-generator')

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    slug: 'name',
    lowercase: true
  }
})

CategorySchema.plugin(autoIncrement, 'Category')
CategorySchema.plugin(slug)

module.exports = mongoose.model('Category', CategorySchema)
