const { ApolloError, ForbiddenError } = require('apollo-server-express')

const Story = require('../models/Story')
const Chapter = require('../models/Chapter')
const User = require('../models/User')
const Category = require('../models/Category')

const UserController = require('./user.controller')
const BunnyCDN = require('../modules/bunnyCDN')
const CHAPTER = require('../config/chapter')

const Event = require('../events')

class StudioController {
  constructor(user) {
    if (!user) {
      throw new ApolloError('Bạn không có quyền truy cập', 'NOTIFY')
    }
    this.user = user
  }

  async stories(order, sort, page, limit) {
    const stories = await Story.find({
      user: UserController.isMod(this.user) ? { $exists: true } : this.user._id
    })
      .populate([
        {
          path: 'user',
          model: User
        },
        {
          path: 'categories',
          model: Category
        }
      ])
      .sort({
        [order]: sort
      })
      .skip(page * limit)
      .limit(limit)
    Object.values(stories).map((value) => {
      value.toObject()
      value.avatar = BunnyCDN.webAssets(value.avatar)
      return value
    })
    return stories
  }

  count() {
    return {
      stories: async () => {
        return Story.find({
          user: UserController.isMod(this.user) ? { $exists: true } : this.user._id
        }).countDocuments()
      },
      chapters: async (story) => {
        const check = await this.story(story)
        return this._countChapter(check._id)
      }
    }
  }

  async _countChapter(story) {
    return Chapter.find({ story }).countDocuments()
  }

  async story(_id) {
    const story = await Story.findOne({
      _id,
      user: UserController.isMod(this.user) ? { $exists: true } : this.user._id
    }).populate([
      {
        path: 'categories',
        model: Category
      }
    ])
    if (!story) {
      throw new ForbiddenError('Truyện không tồn tại')
    }
    return Object.assign({}, story.toObject(), {
      avatar: BunnyCDN.webAssets(story.avatar)
    })
  }

  async chapter(_id) {
    const chapter = await Chapter.findById(_id)
    if (!chapter) {
      throw new ForbiddenError('Chương không tồn tại')
    }
    if (UserController.isMod(this.user)) {
      chapter.toObject()
      chapter.avatar = BunnyCDN.webAssets(chapter.avatar)
      chapter.content.map((value) => {
        value.content = BunnyCDN.webAssets(value.content, true)
      })
      return chapter
    } else {
      // author bình thường
      const story = await Story.findOne({
        _id: chapter.story,
        user: this.user._id
      })
      if (!story) {
        throw new ForbiddenError('Chương không tồn tại')
      }
      chapter.toObject()
      chapter.avatar = BunnyCDN.webAssets(chapter.avatar)
      chapter.content.map((value) => {
        value.content = BunnyCDN.webAssets(value.content, true)
      })
      return chapter
    }
  }

  async chapters(story) {
    const check = await this._basicStory(story)
    if (!check) {
      throw new ForbiddenError('Bạn không có quyền truy cập')
    }
    const chapters = await Chapter.find({ story }).sort({ order: -1 })
    Object.values(chapters).map((chapter) => {
      chapter.avatar = BunnyCDN.webAssets(chapter.avatar, false)
      return chapter
    })
    return chapters
  }

  async createStory(
    title,
    otherTitle,
    author,
    team,
    avatar,
    content,
    adsense,
    listCategories,
    badge
  ) {
    this._validateStoryForm(title, team, avatar)
    const categories = await this._makeListCategories(listCategories)
    return Story.create({
      title,
      otherTitle,
      author,
      team,
      avatar: this._getAvatarPath(avatar),
      content,
      adsense,
      categories,
      badge,
      user: this.user._id,
      createdAt: Date.now(),
      updatedAt: Date.now()
    })
  }

  async updateStory(
    _id,
    title,
    otherTitle,
    author,
    team,
    avatar,
    content,
    adsense,
    listCategories,
    badge
  ) {
    this._validateStoryForm(title, team, avatar)
    const categories = await this._makeListCategories(listCategories)
    return Story.findOneAndUpdate(
      {
        _id,
        user: UserController.isMod(this.user) ? { $exists: true } : this.user._id
      },
      {
        title,
        otherTitle,
        author,
        team,
        avatar: this._getAvatarPath(avatar),
        content,
        adsense,
        badge,
        categories,
        updatedAt: Date.now()
      }
    )
  }

  _validateStoryForm(title, team, avatar) {
    if (!title) {
      throw new ApolloError('Tiêu đề không được để trống', 'NOTIFY')
    }
    if (!team) {
      throw new ApolloError('Tên nhóm dịch là bắt buộc', 'NOTIFY')
    }
    if (!avatar) {
      throw new ApolloError('Ảnh bìa là bắt buộc', 'NOTIFY')
    }
  }

  async _makeListCategories(list) {
    let categories = []
    for (let name of list) {
      if (name) {
        const category = await Category.findOne({ name })
        if (category) {
          categories.push(category._id)
        }
      }
    }
    return categories
  }

  _getAvatarPath(url) {
    try {
      const parsedUrl = new URL(url)
      return parsedUrl.pathname
    } catch (e) {
      throw new ApolloError('Ảnh không hợp lệ', 'NOTIFY')
    }
  }

  async createChapter(storyID, name, nameExtend, avatar, chapContent, publishTime, note) {
    const story = await this.story(storyID)
    if (!story) {
      throw new ForbiddenError('Nội dung không tồn tại')
    }
    if (!name) {
      throw new ApolloError('Tên chương là bắt buộc', 'NOTIFY')
    }
    const content = this._makeChapterContent(chapContent)
    if (!content.length) {
      throw new ApolloError('Nội dung không được để trống', 'NOTIFY')
    }
    if (publishTime && publishTime < Date.now()) {
      throw new ApolloError('Lịch đăng không hợp lệ', 'NOTIFY')
    }
    const chapter = await Chapter.create({
      name,
      avatar: avatar ? this._getAvatarPath(avatar) : '',
      content,
      nameExtend,
      story: story._id,
      postActive: publishTime ? CHAPTER.SCHODULE : CHAPTER.ACTIVE,
      publishTime: publishTime ? publishTime : Date.now(),
      order: await this._getNextOrder(story._id),
      createdAt: Date.now(),
      note
    })
    if (publishTime) {
      await Story.findByIdAndUpdate(story._id, {
        countChapter: await this._countChapter(story._id)
      })
    } else {
      await Story.findByIdAndUpdate(story._id, {
        countChapter: await this._countChapter(story._id),
        updatedAt: Date.now()
      })
    }
    return chapter
  }

  async updateChapter(_id, name, nameExtend, avatar, chapContent, publishTime, note) {
    const chapter = await Chapter.findById(_id)
    if (!chapter) {
      throw new ForbiddenError('Nội dung không tồn tại')
    }
    const check = await this._basicStory(chapter.story)
    if (!check) {
      throw new ForbiddenError('Nội dung không tồn tại')
    }
    if (!name) {
      throw new ApolloError('Tên chương là bắt buộc', 'NOTIFY')
    }
    const content = this._makeChapterContent(chapContent)
    if (!content.length) {
      throw new ApolloError('Nội dung không được để trống', 'NOTIFY')
    }
    if (publishTime && chapter.postActive === CHAPTER.ACTIVE) {
      throw new ApolloError('Không thể lên lịch chương đã đăng', 'NOTIFY')
    }
    await Story.findByIdAndUpdate(chapter._id, { updatedAt: Date.now() })
    Event.updateChapterContent(chapter._id, chapter.content, content)
    return Chapter.findByIdAndUpdate(
      chapter._id,
      {
        name,
        avatar: avatar ? this._getAvatarPath(avatar) : '',
        content,
        nameExtend,
        postActive: publishTime ? CHAPTER.SCHODULE : CHAPTER.ACTIVE,
        publishTime: publishTime,
        note
      },
      { returnOriginal: false }
    )
  }

  _makeChapterContent(raw) {
    const content = []
    Object.values(raw).forEach((value) => {
      if (value.content) {
        content.push({ content: this._getAvatarPath(value.content) })
      }
    })
    return content
  }

  async _getNextOrder(story) {
    const chapter = await Chapter.findOne({
      story
    })
      .sort({ order: -1 })
      .limit(1)
    return chapter ? chapter.order + 1 : 0
  }

  async _basicStory(_id) {
    return Story.findOne({
      _id,
      user: UserController.isMod(this.user) ? { $exists: true } : this.user._id
    })
  }

  async searchStories(keyword, size) {
    const stories = await Story.find({
      user: UserController.isMod(this.user) ? { $exists: true } : this.user._id,
      title: {
        $regex: keyword,
        $options: 'i'
      }
    })
      .populate([
        {
          path: 'user',
          model: User
        },
        {
          path: 'categories',
          model: Category
        }
      ])
      .limit(size)
    Object.values(stories).map((value) => {
      value.toObject()
      value.avatar = BunnyCDN.webAssets(value.avatar)
      return value
    })
    return stories
  }

  delete() {
    return {
      story: async (_id) => {
        const story = await this._basicStory(_id)
        if (!story) {
          throw new ForbiddenError('Bạn không có quyền xoá truyện này')
        }
        const chapters = await Chapter.find({ story: _id })
        await Promise.all([Story.findByIdAndDelete(_id), Chapter.deleteMany({ story: _id })])
        for (const chapter of chapters) {
          Event.clearChapterContent(chapter.content)
        }
        return story
      },

      chapter: async (_id) => {
        const chapter = await Chapter.findById(_id)
        if (!chapter) {
          throw new ForbiddenError('Chương không không tại')
        }
        const story = await this._basicStory(chapter.story)
        if (!story) {
          throw new ForbiddenError('Bạn không có quyền xoá truyện này')
        }
        Event.clearChapterContent(chapter.content)
        return Chapter.findByIdAndDelete(chapter._id)
      }
    }
  }

  async sort(storyID, ids) {
    const story = await this._basicStory(storyID)
    if (!story) {
      throw new ForbiddenError('Bạn không có quyền truy cập')
    }
    let i = ids.length - 1
    for (let _id of ids) {
      await Chapter.findOneAndUpdate({ _id, story: storyID }, { order: i })
      i--
    }
    return true
  }
}

module.exports = StudioController
