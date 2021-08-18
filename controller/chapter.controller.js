const Story = require('../models/Story')
const Chapter = require('../models/Chapter')
const STORY = require('../config/chapter')

class ChapterController {
  async getMany(story) {
    return Chapter.find({ story, postActive: STORY.ACTIVE })
      .sort({ order: -1 })
      .select('-content -source')
  }

  async getOne(_id) {
    const chapter = await Chapter.findOne({ _id, postActive: STORY.ACTIVE })
    if (!chapter) {
      return null
    }
    await Promise.all([
      Chapter.findByIdAndUpdate(_id, { $inc: { views: 1 } }),
      Story.findByIdAndUpdate(chapter.story, { $inc: { views: 1 } })
    ])
    return chapter
  }

  static async forSiteMap() {
    return Chapter.find({ postActive: STORY.ACTIVE }, { _id: 1, slug: 1, story: 1 }).populate({
      path: 'story',
      model: Story,
      select: '_id slug'
    })
  }
}

module.exports = ChapterController
