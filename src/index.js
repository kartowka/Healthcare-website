const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const path = require('path')
const User = require('./models/userModel')
const routes = require('./routes/route')
const appPort = process.env.PORT || 4000
const app = express()

//.env
require('dotenv').config({
  path: path.join(__dirname, './.env')
})

//connect to mongodb
const dbURI = 'mongodb+srv://jsas:RlKoBp5JquF2OvsF@healthcare.eq86f.mongodb.net/healthcare-db?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true ,useCreateIndex: true,})
  .then((result) => app.listen(3000), console.log('mongoDB connected.'))
  .catch((err) => console.log(err))

app.use(express.urlencoded({ extended: true }))

app.use(async (req, res, next) => {
  if (req.headers['x-access-token']) {
    const accessToken = req.headers['x-access-token']
    const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET)
    // Check if token has expired
    if (exp < Date.now().valueOf() / 1000) {
      return res.status(401).json({ error: 'JWT token has expired, please login to obtain a new one' })
    }
    res.locals.loggedInUser = await User.findById(userId); next()
  } else {
    next()
  }
})

//Setting up Handlebars
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, '/views/')))
app.set('views', __dirname + '/views/')
app.use('/css', express.static(__dirname + '/css'))
app.use('/fonts', express.static(__dirname + '/fonts'))
app.use('/js', express.static(__dirname + '/js'))
app.use('/img', express.static(__dirname + '/img'))
app.use('/assets', express.static(__dirname + '/assets'))
app.use('/', routes)


app.use(function (req, res, next) {

  // you can do what ever you want here
  // for example rendering a page with '404 Not Found'
  res.status(404)
  res.render('404', { error: 'Not Found' })

})


//Creating a connection
app.listen(appPort, () => {
  console.log(`App is running. serve at port: ${appPort}`)
  console.log(`http://127.0.0.1:${appPort}`)
})
