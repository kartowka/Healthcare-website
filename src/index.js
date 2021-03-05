const express = require('express')
const appPort = process.env.PORT || 4000
const app = express()
var path = require('path')


app.set('view engine', 'ejs')


//Static File 

app.use(express.static(path.join(__dirname, '/views/')))
app.set('views', __dirname + '/views/')
app.use('/css', express.static(__dirname + '/css'))
app.use('/scripts', express.static(__dirname + '/scripts'))
//app.use('/img',express.static(__dirname +'public/img'))


//app.get('/login', function(req, res) {
//    res.sendFile(__dirname + '/login.html')
//})

app.get('/', (req, res) => {
    res.render('index', { title: 'Home Page' })
})

app.listen(appPort, () => {
    console.log(`App is running. serve at port: ${appPort}`)
    console.log(`http://127.0.0.1:${appPort}`)
})
