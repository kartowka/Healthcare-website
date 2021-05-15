const express = require('express')
const router = express.Router()
const user_controller = require('../controllers/user_controller')
const forum_controller = require('../controllers/forum_controller')
const password_controller = require('../controllers/recover_pass_controller')
const insurance_controller = require('../controllers/insurance_controller')
const profile_router = require('./profile_route')
const Forum = require('../models/forum_model')
const forumRouter = require('./forum_route')
const searchRouter = require('./search_route')


//homepage
router.route('/').get((req, res) => {
  res.render('index')
})
//our team
router.route('/our_team').get((req, res) => {
  res.render('our_team')
})
//appointment management test button
router.route('/appointment_management').get((req, res) => {
  res.render('appointment_management')
})

// restricted
router
    .route('/restricted/:error/:statusCode')
    .get((req, res) => {
        res.render('restricted', { alert: req.params.error,statusCode:req.params.statusCode})
    })
//login
router
  .route('/login')
  .get(user_controller.denyIfLoggedin, (req, res) => {
    res.render('login', { alert: req.error })
  })
  .post(user_controller.login, (req, res) => {
    res.render('login', { alert: req.error })
  })
//logout
router.route('/logout').get((req, res) => {
  res.clearCookie('x-access-token')
  res.redirect('/')
})
//signup
router
  .route('/register')
  .get(user_controller.denyIfLoggedin, (req, res) => {
    res.render('register')
  })
  .post(user_controller.signup, (req, res) => {
    res.render('register', { alert: req.error })
  })

//signup
router
  .route('/travel_insurance')
  .get((req, res) => {
    res.render('travel_insurance')
  })
  .post(insurance_controller.getInsurancePolicy, (req, res) => {
    res.render('travel_insurance', { alert: req.error })
  })

//forgot password
router
  .route('/forgot_password')
  .get(user_controller.denyIfLoggedin, (req, res) => {
    res.render('forgot_password')
  })
  .post(password_controller.forgotPassword)

//password reset
router
  .route('/reset_password/:accessToken')
  .get(user_controller.denyIfLoggedin, async (req, res) => {
      const { accessToken } = req.params
      res.render('reset_password')
  })
  .post(password_controller.passwordReset)

//confirmation code
router.route('/confirm/:confirmationCode').get(user_controller.verifyUser)

router.use(profile_router)

//admin interface
router
  .route('/admin_interface/:id')
  .get(
    user_controller.allowIfLoggedin,
    user_controller.grantAccess('readAny', 'admin_interface'),
    user_controller.getUsers,
    forum_controller.getForums,
    (req, res) => {
      res.render('admin_interface', {
        users: req.params.users,
        forums: req.params.forums,
        alert: req.error,
      })
    }
  )
  .post(user_controller.getUsers, async (req, res) => {
    if (Object.keys(req.body)[0] === 'delete_ID')
      await user_controller.deleteUser(req, res)
    if (Object.keys(req.body)[0] === 'approve_ID')
      await user_controller.verifyDoctor(req, res)
    if (Object.keys(req.body)[0] === 'auth_forum')
      await forum_controller.authForum(req, res)
    //res.render('admin_interface', { users: req.params.users, alert: req.error })
  })
router.use('/forum',forumRouter)
router.use('/search',searchRouter)

router.use(function (req, res, next) {
  // you can do what ever you want here
  // for example rendering a page with '404 Not Found'
  res.status(404)
  res.render('404', { error: 'Not Found' })
})

module.exports = router
