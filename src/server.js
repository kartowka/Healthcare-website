const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const path = require('path')
const User = require('./models/user_model')
const routes = require('./routes/route')
const appPort = process.env.PORT
const methodOverride = require('method-override')
const app = express()
const cookieParser = require('cookie-parser')


app.use(cookieParser())
app.locals.userLoggedIn = 0
app.locals.userID = ''
app.locals.userRole = ''

//.env
require('dotenv').config({
  path: path.join(__dirname, './.env')
})


//connect to mongodb
mongoose.connect(process.env.dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
  .then((result) => app.listen(3000), console.log('mongoDB connected.'))
  .catch((err) => console.log(err))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(async (req, res, next) => {
  if (req.cookies['x-access-token']) {
    try {
      const accessToken = req.cookies['x-access-token']
      const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET)
      // If token has expired
      if (exp < Date.now().valueOf() / 1000) {
        return res.status(401).json({
          error: 'JWT token has expired, please login to obtain a new one'
        })
      }
      res.locals.loggedInUser = await User.findById(userId)
      if (res.locals.loggedInUser) {
        res.locals.userLoggedIn = 1
        res.locals.userRole=res.locals.loggedInUser.role
        res.locals.userID = userId

      }
      next()
    } catch (error) {
      next(error)
    }
  } else {
    res.locals.userLoggedIn = 0
    next()
  }
})

//Setting up Handlebars
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use('/src', express.static(__dirname + '/src'))
app.use('/views', express.static(__dirname + '/views'))
app.use('/fonts', express.static(__dirname + '/fonts'))
app.use('/js', express.static(__dirname + '/js'))
app.use('/img', express.static(__dirname + '/img'))
app.use('/assets', express.static(__dirname + '/assets'))
app.use('/scripts', express.static(path.join(__dirname, '..', 'node_modules/accessibility/')))
app.use('/', routes)


//Creating a connection
app.listen(appPort, () => {
  console.log(`App is running. serve at port: ${appPort}`)
  console.log(`http://127.0.0.1:${appPort}`)
})