const express = require('express')
const router = express.Router()
const user_controller = require('../controllers/user_controller')
const profile_router = require('./profile_route')

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
    .post(user_controller.login)
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
    .post(user_controller.signup)

//forgot password
router
    .route('/forgot_password')
    .get((req, res) => {
        res.render('forgot_password')
    })
    .post(user_controller.forgotPassword)
router
    .route('/reset_password/:accessToken')
    .get(async (req, res) => {
        const {accessToken} = req.params
        res.render('reset_password')
    })
    .post(user_controller.passwordReset)

router
    .route('/confirm/:confirmationCode')
    .get(user_controller.verifyUser)

router.use(profile_router)

//previous appointments

router
    .route('/user/:userId')
    .get(user_controller.allowIfLoggedin, user_controller.getUser)
//.put(user_controller.allowIfLoggedin, user_controller.grantAccess('updateAny', 'profile'), user_controller.updateUser)
//.delete('/user/:userId', user_controller.allowIfLoggedin, user_controller.grantAccess('deleteAny', 'profile'), user_controller.deleteUser)

router
    .route('/users')
    .get(user_controller.allowIfLoggedin, user_controller.grantAccess('readAny', 'profile'), user_controller.getUsers)


router.use(function (req, res, next) {

    // you can do what ever you want here
    // for example rendering a page with '404 Not Found'
    res.status(404)
    res.render('404', { error: 'Not Found' })

})

module.exports = router