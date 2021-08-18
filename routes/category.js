const express = require('express')
const router = express.Router()

const categoryController = require('../controller/category.controller')

router.get('/the-loai/:slug.:id', async ({ params, query }, res, next) => {
  const CategoryController = new categoryController()
  const category = await CategoryController.getOne(parseInt(params.id))
  if (!category) {
    return res.redirect('/404')
  }
  const [count, stories] = await Promise.all([
    CategoryController.getCountStory(category._id),
    CategoryController.categoryGetBooks(
      category._id,
      query.order || 'updatedAt',
      0,
      8
    )
  ])
  res.render('category', {
    category,
    count,
    order: query.order,
    stories
  })
})

module.exports = router
