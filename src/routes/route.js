const express = require('express')
const router = express.Router()
const user_controller = require('../controllers/user_controller')
const profile_router = require('./profile_route')
const User = require('../models/user_model')

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

//password reset
router
    .route('/reset_password/:accessToken')
    .get(async (req, res) => {
        const { accessToken } = req.params
        res.render('reset_password')
    })
    .post(user_controller.passwordReset)

//confirmation code    
router
    .route('/confirm/:confirmationCode')
    .get(user_controller.verifyUser)

router.use(profile_router)

//previous appointments

router
    .route('/user/:userId')
    .post(user_controller.allowIfLoggedin, user_controller.deleteUser)
    .post(user_controller.allowIfLoggedin, user_controller.updateUser)
//.put(user_controller.allowIfLoggedin, user_controller.grantAccess('updateAny', 'profile'), user_controller.updateUser)

//admin interface
router
    .route('/admin_interface')
    .get(async function (req, res, next) { //this is the function call
        User.find({}).exec(function (err, data) {
            if (err) throw err
            res.render('admin_interface', { title: 'Employee Records', users: data}) //user-table.ejs (records this is the data as an object)
        })
    })

//admin delete user

router.use(function (req, res, next) {

    // you can do what ever you want here
    // for example rendering a page with '404 Not Found'
    res.status(404)
    res.render('404', { error: 'Not Found' })

})

module.exports = router