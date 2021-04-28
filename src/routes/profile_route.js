const express = require('express')
const router = require('./route')
const profile = express.Router()
const user_controller = require('../controllers/user_controller')
const User = require('../models/user_model')



//pateint profile
profile
    .route('/patient_profile/:id') 
    .get(user_controller.allowIfLoggedin, user_controller.grantAccess('readAny', 'doctor_profile'), user_controller.getUser)

//settings patient profile
profile
    .route('/settings_patient_profile/:id') 
    .get(user_controller.allowIfLoggedin, user_controller.grantAccess('readOwn', 'patient_profile'), user_controller.getUser)
    .post(user_controller.allowIfLoggedin,user_controller.grantAccess('updateOwn','patient_profile'),user_controller.updateUser)

//previous appointments
profile
    .route('/previous_appointments/:id')
    .get(user_controller.allowIfLoggedin, user_controller.grantAccess('readAny', 'doctor_profile'), user_controller.getUser)
    

//future appointments
profile
    .route('/future_appointments/:id')
    .get(user_controller.allowIfLoggedin, user_controller.grantAccess('readAny', 'doctor_profile'), user_controller.getUser)
  


//doctor profile
profile
    .route('/doctor_profile/:id')
    .get(user_controller.allowIfLoggedin, user_controller.grantAccess('readAny','patient_profile'),user_controller.grantAccess('readAny','doctor_profile'), user_controller.getUser)
    .post(user_controller.allowIfLoggedin,user_controller.grantAccess('updateOwn','doctor_profile'),user_controller.updateUser)
// TBD

module.exports = profile