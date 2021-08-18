const { v4: uuidv4 } = require('uuid')
const bunnycdn = require('../modules/bunnyCDN')
const Event = require('../events')

const Image = require('../modules/image')

class UploadController {
  /**
   * @param path
   * @returns {string}
   * @private
   */
  _buildPath(path) {
    const time = new Date()
    return `/${path}/${time.getFullYear()}/${time.getMonth() + 1}/${
      time.getDay() + 1
    }/${time.getHours()}/${uuidv4()}.jpeg`
  }

  /**
   * @param type
   * @param { { path: String } } file
   * @param { String } path
   * @returns {Promise<null>}
   */
  async uploadSingle(type, file, path) {
    try {
      let { image, securePath } = await this._detachPath(type, file.path)
      let path1 = this._buildPath(path)
      const BunnyCDN = new bunnycdn(securePath)
      await BunnyCDN.upload(image, path1)
      Event.removeFile(file.path)
      return bunnycdn.webAssets(path1, securePath)
    } catch (e) {
      console.log(e)
      Event.removeFile(file.path)
      return null
    }
  }

  /**
   * Xác định secure pth và resize
   * @param type
   * @param file
   * @returns {Promise<{image: *, securePath: boolean}>}
   * @private
   */
  async _detachPath(type, file) {
    let image
    let securePath = false
    const Picture = new Image(file)
    switch (type) {
      case 'user-avatar':
        image = await Picture.resize(150, 150)
        break
      case 'story-avatar':
        image = await Picture.resizeWithWater('credit@180.png', 600, 800, 720, 210)
        break
      case 'chapter-avatar':
        // width: 500, height: 312
        image = await Picture.resizeWithWater('credit@110.png', 500, 310, 260, 26)
        break
      case 'chapter-content':
        securePath = true
        image = await Picture.resizeWithWater('watermark@160.png', 1000, null, 26, 814)
        break
      default:
        image = await Picture.resize(300)
    }
    return { image, securePath }
  }
}

module.exports = UploadController
