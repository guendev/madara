const express = require('express')
const router = express.Router()

const storyController = require('../controller/story.controller')

router.get('/', async (req, res, next) => {
  const StoryController = new storyController()
  const [stories, topViews] = await Promise.all([
    StoryController.getManyWithChapter('updatedAt', 0, 8, 2),
    StoryController.getManyWithChapter('views', 0, 6, 2)
  ])
  let slider = []
  try {
    slider = require('../slider.js')
  } catch (e) {}
  res.render('index', { stories, topViews, slider })
})

module.exports = router
