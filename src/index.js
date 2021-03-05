const express = require('express')
const appPort = process.env.PORT || 4000
const app = express()

app.get('/', (req, res)=> {
    res.send('hello world')
})

app.listen(appPort,() => {
    console.log(`App is running. serve at port: ${appPort}`)
    console.log(`http://127.0.0.1:${appPort}`)
})
