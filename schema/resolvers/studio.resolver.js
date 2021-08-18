const StudioController = require('../../controller/studio.controller')

module.exports = {
  Query: {
    myStories: async (_, { order, sort, page, limit }, { user }) => {
      const studioController = new StudioController(user)
      return studioController.stories(order, sort, page, limit)
    },

    countStories: async (_, {}, { user }) => {
      const studioController = new StudioController(user)
      return studioController.count().stories()
    },

    myStory: async (_, { id }, { user }) => {
      const studioController = new StudioController(user)
      return studioController.story(id)
    },

    myChapter: async (_, { id }, { user }) => {
      const studioController = new StudioController(user)
      return studioController.chapter(id)
    },

    searchMyStories: async (_, { keyword, size }, { user }) => {
      const studioController = new StudioController(user)
      return studioController.searchStories(keyword, size)
    },

    myChapters: async (_, { id }, { user }) => {
      const studioController = new StudioController(user)
      return studioController.chapters(id)
    }
  },

  Mutation: {
    publishStory: async (
      _,
      {
        input: {
          _id,
          title,
          otherTitle,
          author,
          team,
          avatar,
          content,
          adsense,
          categories,
          badge
        }
      },
      { user }
    ) => {
      const studioController = new StudioController(user)
      if (_id) {
        return studioController.updateStory(
          _id,
          title,
          otherTitle,
          author,
          team,
          avatar,
          content,
          adsense,
          categories,
          badge
        )
      } else {
        return studioController.createStory(
          title,
          otherTitle,
          author,
          team,
          avatar,
          content,
          adsense,
          categories,
          badge
        )
      }
    },

    publishChapter: async (
      _,
      {
        input: {
          _id,
          name,
          content,
          avatar,
          story,
          nameExtend,
          publishTime,
          note
        }
      },
      { user }
    ) => {
      const studioController = new StudioController(user)
      if (_id) {
        return studioController.updateChapter(
          _id,
          name,
          nameExtend,
          avatar,
          content,
          publishTime,
          note
        )
      }
      return studioController.createChapter(
        story,
        name,
        nameExtend,
        avatar,
        content,
        publishTime,
        note
      )
    },

    deleteStory: async (_, { _id }, { user }) => {
      const studioController = new StudioController(user)
      return studioController.delete().story(_id)
    },

    deleteChapter: async (_, { _id }, { user }) => {
      const studioController = new StudioController(user)
      return studioController.delete().chapter(_id)
    },

    sortMyChapters: async (_, { _id, ids }, { user }) => {
      const studioController = new StudioController(user)
      return studioController.sort(_id, ids)
    }
  }
}
