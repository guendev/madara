const Story = require('../models/Story')
const Chapter = require('../models/Chapter')
const Category = require('../models/Category')

const CHAPTER = require('../config/chapter')

class StoryController {
  async getOne(_id) {
    return Story.findById({ _id }).populate([
      {
        path: 'categories',
        model: Category
      }
    ])
  }

  async getMany(order, page, limit) {
    return Story.find({})
      .populate({
        path: 'categories',
        model: Category
      })
      .sort({
        [order]: -1
      })
      .skip(page * limit)
      .limit(limit)
  }

  async getManyWithChapter(order, page, limit, countChapter) {
    const stories = await this.getMany(order, page, limit)
    return this.addChaptersToStory(stories, countChapter)
  }

  async addChaptersToStory(stories, countChapter) {
    const result = []
    for (let story of stories) {
      const chapters = await Chapter.find({
        story: story._id,
        postActive: CHAPTER.ACTIVE
      })
        .select('-content')
        .sort({ order: -1 })
        .limit(countChapter)
      result.push({ story, chapters })
    }
    return result
  }

  async count() {
    return Story.countDocuments()
  }

  async searchCount(keyword) {
    return Story.find({
      title: {
        $regex: keyword,
        $options: 'i'
      }
    }).countDocuments()
  }

  async search(keyword, page, limit) {
    const stories = await Story.find({
      title: {
        $regex: keyword,
        $options: 'i'
      }
    })
      .populate({
        path: 'categories',
        model: Category
      })
      .skip(page * limit)
      .limit(limit)
    return this.addChaptersToStory(stories, 2)
  }

  async quickSearch(keyword, size) {
    return Story.find({
      title: {
        $regex: keyword,
        $options: 'i'
      }
    }).limit(size)
  }

  static async forSiteMap() {
    return Story.find({}, { _id: 1, slug: 1, updatedAt: 1 })
  }
}

module.exports = StoryController
