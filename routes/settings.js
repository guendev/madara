const express = require('express')
const router = express.Router()

router.get('/:type(history|bookmark|account)', async (req, res, next) => {
  if (!res.locals.user) {
    return res.status(401).redirect('/404')
  }
  return res.render('settings')
})

module.exports = router
