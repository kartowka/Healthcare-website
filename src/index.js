const express = require('express')
const appPort = process.env.PORT || 4000
const app = express()
var path = require('path')
const mongoose = require('mongoose')
const User = require('./models/user')

//connect to mongodb
const dbURI = 'mongodb+srv://jsas:q8L74rSEkuhuWU6k@healthcare.eq86f.mongodb.net/healthcare-db?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err))


//Setting up Handlebars
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, '/views/')))
app.set('views', __dirname + '/views/')
app.use('/css', express.static(__dirname + '/css'))
app.use('/fonts', express.static(__dirname + '/fonts'))
app.use('/js', express.static(__dirname + '/js'))
app.use('/img', express.static(__dirname + '/img'))


//routing
app.get('/', (req, res) => {
  res.render('index', { title: 'Home Page' })
})

app.get('/login', function (req, res) {
  res.render('login', { title: 'login' })
})


app.use(function (req, res, next) {

  // you can do what ever you want here
  // for example rendering a page with '404 Not Found'
  res.status(404)
  res.render('404', { error: 'Not Found' })

})

//mongoose and mongo sandbox routes

//Creating a connection
app.listen(appPort, () => {
  console.log(`App is running. serve at port: ${appPort}`)
  console.log(`http://127.0.0.1:${appPort}`)
})
