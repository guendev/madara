const express = require('express')
const router = express.Router()

const storyController = require('../controller/story.controller')
const chapterController = require('../controller/chapter.controller')
const BunnyCDN = require('../modules/bunnyCDN')

router.get('/truyen-tranh/:slug.:id', async ({ params }, res) => {
  const StoryController = new storyController()
  const story = await StoryController.getOne(parseInt(params.id))
  if (!story) {
    return res.redirect('/404')
  }
  const ChapterController = new chapterController()
  const chapters = await ChapterController.getMany(story._id)
  return res.render('story', {
    story,
    chapters
  })
})

router.get(
  '/truyen-tranh/:slug.:id/:chap.:chapid',
  async ({ params }, res, next) => {
    const StoryController = new storyController()
    const ChapterController = new chapterController()
    const [story, chapter] = await Promise.all([
      StoryController.getOne(parseInt(params.id)),
      ChapterController.getOne(parseInt(params.chapid))
    ])
    if (!chapter || !chapter) {
      return res.redirect('/404')
    }
    chapter.avatar = BunnyCDN.webAssets(chapter.avatar)
    chapter.content.map((value) => {
      value.content = BunnyCDN.webAssets(value.content, true)
    })
    const chapters = await ChapterController.getMany(story._id)
    res.render('chapter', {
      story,
      chapter,
      chapters
    })
  }
)

router.get('/truyen-tranh', async ({ query }, res, next) => {
  const StoryController = new storyController()
  const [count, stories] = await Promise.all([
    StoryController.count(),
    StoryController.getManyWithChapter(query.order || 'updatedAt', 0, 8, 2)
  ])
  res.render('stories', {
    count,
    order: query.order,
    stories
  })
})

router.get('/tim-kiem', async ({ query }, res, next) => {
  const keyword = query.keyword
  if (!keyword) {
    return res.redirect('/404')
  }
  const StoryController = new storyController()
  const [count, stories] = await Promise.all([
    StoryController.searchCount(keyword),
    StoryController.search(keyword, 0, 8)
  ])
  res.render('search', {
    keyword,
    count,
    order: query.order,
    stories
  })
})

module.exports = router
