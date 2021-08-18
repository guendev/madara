require('dotenv').config()

const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')

const apolloServer = require('./schema')

const app = express()

apolloServer.applyMiddleware({ app })

//  apply to all requests
// app.use(limiter)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

const homeRouter = require('./routes/index')
const storyRouter = require('./routes/story')
const categoryRouter = require('./routes/category')
const aboutRoutes = require('./routes/about')

const uploadRoutes = require('./routes/upload')
const siteMapRoutes = require('./routes/sitemap')

app.use('/sitemap', siteMapRoutes)

const sideBar = require('./utilities/sidebar')
const authRoutes = require('./utilities/auth')

app.use(sideBar)
app.use(authRoutes)

app.use(uploadRoutes)

app.use(homeRouter)
app.use(storyRouter)
app.use(categoryRouter)
app.use(aboutRoutes)
app.use('/settings', require('./routes/settings'))

app.use(function (req, res) {
  return res.status(404).render('error')
})

if (process.env.NODE_ENV === 'production') {
  require('./jobs')
}
module.exports = app
