const mongoose = require('mongoose')

const ChapterSchema = new mongoose.Schema({
  web: {
    type: String,
    required: true
  },
  source: {
    type: String,
    index: true
  }
})

ChapterSchema.pre('save', async function (next, node) {
  if (!this.source) {
    return next()
  }
  const check = await this.constructor.findOne({ source: this.source })
  if (check) {
    this.invalidate('source', 'source must be unique')
    return next(new Error('Source must be unique'))
  }
  return next()
})
module.exports = mongoose.model('BlackList', ChapterSchema)
