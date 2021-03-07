const express = require('express')
const appPort = process.env.PORT || 4000
const app = express()
var path = require('path')

//Setting up Handlebars
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, '/views/')))
app.set('views', __dirname + '/views/')
app.use('/css', express.static(__dirname + '/css'))
app.use('/scripts', express.static(__dirname + '/scripts'))
app.use('/img',express.static(__dirname +'/img'))


//routing
app.get('/', (req, res) => {
  res.render('index', { title: 'Home Page' })
})

app.get('/login', function(req, res) {
  res.render('login', { title: 'login' })
})


app.get('/signup', function(req, res) {
  res.render('signup', { title: 'Sign up' })
})


app.get('/password_reset', function(req, res) {
  res.render('password_reset', { title: 'password reset' })
})


app.use( function(req, res, next) {

    // you can do what ever you want here
    // for example rendering a page with '404 Not Found'
    res.status(404)
    res.render('404', { error: 'Not Found'})

})

//Creating a connection
app.listen(appPort, () => {
  console.log(`App is running. serve at port: ${appPort}`)
  console.log(`http://127.0.0.1:${appPort}`)
})
