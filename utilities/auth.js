const authController = require('../controller/auth.controller')

module.exports = async ({ cookies }, res, next) => {
  let user = undefined
  if (cookies._token) {
    const AuthController = new authController()
    user = await AuthController.getUser(cookies._token)
  }
  res.locals.user = user
  next()
}
