const { ApolloError, ForbiddenError } = require('apollo-server-express')

const CategoryController = require('../../controller/category.controller')
const storyController = require('../../controller/story.controller')
const BunnyCDN = require('../../modules/bunnyCDN')
const categoryController = require('../../controller/category.controller')

module.exports = {
  Query: {
    getCategories: async () => {
      const categoryController = new CategoryController()
      return categoryController.all()
    },

    getStoriesWithChapter: async (_, { order, page, limit }) => {
      const StoryController = new storyController()
      const stories = await StoryController.getManyWithChapter(
        order,
        page,
        limit,
        2
      )
      Object.values(stories).map((value) => {
        value.story.avatar = BunnyCDN.webAssets(value.story.avatar)
        return value
      })
      return stories
    },

    getStoriesWithChapterByCategory: async (_, { id, order, page, limit }) => {
      const CategoryController = new categoryController()
      const category = await CategoryController.getOne(id)
      if (!category) {
        throw new ForbiddenError('Catgory không tồn tại')
      }
      const stories = await CategoryController.categoryGetBooks(
        id,
        order,
        page,
        limit
      )
      Object.values(stories).map((value) => {
        value.story.avatar = BunnyCDN.webAssets(value.story.avatar)
        return value
      })
      return stories
    },

    quickSearch: async (_, { keyword, size }) => {
      const StoryController = new storyController()
      const stories = await StoryController.quickSearch(keyword, size)
      Object.values(stories).map((value) => {
        value.avatar = BunnyCDN.webAssets(value.avatar)
        return value
      })
      return stories
    },

    searchStoriesWithChapter: async (_, { keyword, page, limit }) => {
      const StoryController = new storyController()
      const stories = await StoryController.search(keyword, page, limit)
      Object.values(stories).map((value) => {
        value.story.avatar = BunnyCDN.webAssets(value.story.avatar)
        return value
      })
      return stories
    },

    getStoriesRelated: async () => {
      const StoryController = new storyController()
      const stories = await StoryController.getMany('createdAt', 0, 4)
      Object.values(stories).map((value) => {
        value.avatar = BunnyCDN.webAssets(value.avatar)
        return value
      })
      return stories
    }
  }
}
