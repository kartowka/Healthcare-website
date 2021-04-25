const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

//homepage
router
    .route('/')
    .get((req, res) => {
        res.render('index')
    })
//login
router
    .route('/login')
    .get((req, res) => {
        res.render('login')
    })
    .post(userController.login)
//logout
router
    .route('/logout')
    .get((req, res) => {
        res.clearCookie('x-access-token')
        res.redirect('/')
    })
//signup
router
    .route('/register')
    .get((req, res) => {
        res.render('register')
    })
    .post(userController.signup)

//forgot password
router
    .route('/forgot-password')
    .get((req, res) => {
        res.render('forgot-password')
    })

router
    .route('/confirm/:confirmationCode')
    .get(userController.verifyUser)

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
router
.route('/user/:userId')
.get(userController.allowIfLoggedin,userController.getUser)
//.put('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateUser)
//.delete('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser)

router
.route('/users')
.get(userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getUsers)


router.use(function (req, res, next) {

    // you can do what ever you want here
    // for example rendering a page with '404 Not Found'
    res.status(404)
    res.render('404', { error: 'Not Found' })

})

module.exports = router