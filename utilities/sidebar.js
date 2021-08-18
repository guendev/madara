const moment = require('moment')

const storyController = require('../controller/story.controller')
const Category = require('../models/Category')
const BunnyCDN = require('../modules/bunnyCDN')

module.exports = async (req, res, next) => {
  const StoryController = new storyController()
  const [topTrending, categories] = await Promise.all([
    StoryController.getManyWithChapter('views', 0, 4, 2),
    Category.find()
  ])
  res.locals.topTrending = topTrending
  res.locals.categories = categories
  res.locals.webAssets = BunnyCDN.webAssets
  res.locals.moment = moment
  res.locals.lightTheme = !!req.cookies.lightTheme
  next()
}
