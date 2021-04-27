const express = require('express')
const router = require('./route')
const profile = express.Router()
const user_controller = require('../controllers/user_controller')
const User = require('../models/user_model')



//pateint profile
profile
    .route('/patient_profile/:id')
    .get(user_controller.allowIfLoggedin, function (req, res) {
        res.render('patient_profile')
    })
profile
    .route('/patient_profile/previous_appointments')
    .get(user_controller.allowIfLoggedin, function (req, res) {
        res.render('previous_appointments')
    })

//future appointments
profile
    .route('/patient_profile/future_appointments')
    .get(user_controller.allowIfLoggedin, function (req, res) {
        res.render('future_appointments')
    })

//doctor profile
profile
    .route('/doctor_profile/:id')
    .get(user_controller.allowIfLoggedin,user_controller.getUser,user_controller.grantAccess('readAny', 'doctor_profile'))
    .put(user_controller.allowIfLoggedin, user_controller.grantAccess('updateAny', 'doctor_profile'))
// TBD

module.exports = profile