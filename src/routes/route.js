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

//signup page
router.get('/register', function (req, res) {
    res.render('register')
})

router.post('/register', userController.signup)

//login page
router.get('/login', function (req, res) {
    res.render('login')
})

router.post('/login', userController.login)

router.post('/index', userController.login)
//router.get('/user/:userId', userController.allowIfLoggedin, userController.getUser)

//router.get('/users', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getUsers)

//router.put('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateUser)

//router.delete('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser)

module.exports = router