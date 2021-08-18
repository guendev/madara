const express = require('express')
const router = express.Router()
const upload = require('../config/multer')
const uploadController = require('../controller/upload.controller')

router.post('/upload/single', upload.single('image'), async ({ file, body }, res, next) => {
  const UploadController = new uploadController()
  const path = await UploadController.uploadSingle(body.type, file, body.pathName || file.path)
  if (path) {
    return res.status(200).json({
      msg: 'Thành công',
      success: true,
      data: path
    })
  }
  return res.status(500)
})

module.exports = router
