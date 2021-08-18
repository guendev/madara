const CronJob = require('cron').CronJob

const Chapter = require('../../models/Chapter')
const Story = require('../../models/Story')

const CHAPTER = require('../../config/chapter')

module.exports = new CronJob(
  '0 */10 * * * *',
  async () => {
    try {
      const chapters = await Chapter.find({
        postActive: CHAPTER.SCHODULE,
        publishTime: {
          $lte: Date.now()
        }
      })
      for (let chapter of chapters) {
        await Promise.all([
          Chapter.findByIdAndUpdate(chapter._id, {
            postActive: CHAPTER.ACTIVE,
            createdAt: Date.now()
          }),
          Story.findByIdAndUpdate(chapter.story, { updatedAt: Date.now() })
        ])
      }
    } catch (e) {
      console.log('Error when publish Chapter')
    }
  },
  null,
  true,
  'Asia/Ho_Chi_Minh'
)
