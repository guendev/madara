const express = require('express')
const router = express.Router()
const { SitemapStream, streamToPromise } = require('sitemap')
const { createGzip } = require('zlib')

const CategoryController = require('../controller/category.controller')
const StoryController = require('../controller/story.controller')
const ChapterController = require('../controller/chapter.controller')

/* GET users listing. */
router.get('/categories.xml', async (req, res, next) => {
  try {
    let sitemap
    const smStream = new SitemapStream({ hostname: process.env.DOMAIN })
    const pipeline = smStream.pipe(createGzip())

    const stories = await CategoryController.forSiteMap()
    for (let post of stories) {
      // pipe your entries or directly write them.
      smStream.write({
        url: '/the-loai/' + post.slug + '.' + post._id,
        changefreq: 'daily',
        priority: 0.3
      })
    }
    // cache the response
    streamToPromise(pipeline).then((sm) => (sitemap = sm))
    // make sure to attach a write stream such as streamToPromise before ending
    smStream.end()
    // stream write the response
    pipeline.pipe(res).on('error', (e) => {
      throw e
    })
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
})

router.get('/stories.xml', async (req, res, next) => {
  res.header('Content-Type', 'application/xml')
  res.header('Content-Encoding', 'gzip')

  try {
    let sitemap
    const smStream = new SitemapStream({ hostname: process.env.DOMAIN })
    const pipeline = smStream.pipe(createGzip())

    const stories = await StoryController.forSiteMap()
    for (let post of stories) {
      // pipe your entries or directly write them.
      smStream.write({
        url: '/truyen-tranh/' + post.slug + '.' + post._id,
        changefreq: 'daily',
        priority: 0.3
      })
    }
    // cache the response
    streamToPromise(pipeline).then((sm) => (sitemap = sm))
    // make sure to attach a write stream such as streamToPromise before ending
    smStream.end()
    // stream write the response
    pipeline.pipe(res).on('error', (e) => {
      throw e
    })
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
})

router.get('/chapters.xml', async (req, res, next) => {
  res.header('Content-Type', 'application/xml')
  res.header('Content-Encoding', 'gzip')

  try {
    let sitemap
    const smStream = new SitemapStream({ hostname: process.env.DOMAIN })
    const pipeline = smStream.pipe(createGzip())

    const stories = await ChapterController.forSiteMap()
    for (let post of stories) {
      // pipe your entries or directly write them.
      smStream.write({
        url:
          '/truyen-tranh/' +
          post.story.slug +
          '.' +
          post.story._id +
          '/' +
          post.slug +
          '.' +
          post._id,
        changefreq: 'daily',
        priority: 0.3
      })
    }
    // cache the response
    streamToPromise(pipeline).then((sm) => (sitemap = sm))
    // make sure to attach a write stream such as streamToPromise before ending
    smStream.end()
    // stream write the response
    pipeline.pipe(res).on('error', (e) => {
      throw e
    })
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
})

module.exports = router
