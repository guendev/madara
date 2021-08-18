const { ForbiddenError } = require('apollo-server-express')

const Story = require('../models/Story')
const Category = require('../models/Category')

const StoryController = require('./story.controller')

class CategoryController {
  async getOne(_id) {
    const category = await Category.findById(_id)
    if (!category) {
      throw new ForbiddenError('Nội dung không tồn tại')
    }
    return category
  }

  async categoryGetBooks(id, order, page, limit) {
    const stories = await Story.find({
      categories: {
        $elemMatch: { $eq: id }
      }
    })
      .populate({
        path: 'categories',
        model: Category
      })
      .sort({
        [order]: -1
      })
      .skip(page * limit)
      .limit(limit)
    const storyController = new StoryController()
    return storyController.addChaptersToStory(stories, 2)
  }

  async getCountStory(_id) {
    return Story.find({
      categories: {
        $elemMatch: { $eq: _id }
      }
    }).countDocuments()
  }

  async all() {
    return Category.find()
  }

  static async forSiteMap() {
    return Category.find({}, { _id: 1, slug: 1 })
  }
}

module.exports = CategoryController
