require('dotenv').config({ path: '../../../.env' })
const BunnyCDN = require('../index')
;(async function () {
  const Bunny = new BunnyCDN(true)
  await Bunny.remove('/test/image-01.jpg')
})()
