const sharp = require('sharp')

module.exports = class {
  constructor(image) {
    this.image = image
  }

  async resize(width, height) {
    return sharp(this.image).jpeg({}).resize(width, height, { fit: 'cover' }).toBuffer()
  }

  async resizeWithWater(input, width, height, top, left, gravity = 'southeast') {
    return sharp(this.image)
      .jpeg({})
      .resize(width, height, { fit: 'cover' })
      .composite([{ input: __dirname + '/lib/' + input, gravity, top, left }])
      .toBuffer()
  }
}
