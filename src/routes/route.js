const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
//homepage
router.get('/', function (req, res) {
    res.render('index')
})

//pateint profile
router.get('/patientProfile', function (req, res) {
    res.render('patientProfile')
})

//doctor profile
router.get('/doctorProfile', function (req, res) {
    res.render('doctorProfile')
})

//previous appointments
router.get('/patientProfile/previousAppointments', function (req, res) {
    res.render('previousAppointments')
})


//future appointments
router.get('/patientProfile/futureAppointments', function (req, res) {
    res.render('futureAppointments')
})


//signup page
router.get('/register', function (req, res) {
    res.render('register')
})

//forgot password
router.get('/forgot-password', function (req, res) {
    res.render('forgot-password')
})

router.post('/register', userController.signup)

//login page
router.get('/login', function (req, res) {
    res.render('login')
})
router.post('/login', userController.login)
router.get('/logout',function(req, res) {
    res.clearCookie('x-access-token')
    res.redirect('/')
}) 
router.get('/confirm/:confirmationCode', function(req,res){
    console.log(req.params.confiramationCode)
} )

router.get('/user/:userId', userController.allowIfLoggedin, userController.getUser)

router.get('/users', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getUsers)

router.put('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateUser)

router.delete('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser)

router.use(function (req, res, next) {

    // you can do what ever you want here
    // for example rendering a page with '404 Not Found'
    res.status(404)
    res.render('404', { error: 'Not Found' })
  
  })

module.exports = router