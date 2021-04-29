const express = require('express')
const profile = express.Router()
const user_controller = require('../controllers/user_controller')


//pateint profile
profile
    .route('/patient_profile/:id') 
    .get(user_controller.allowIfLoggedin, user_controller.grantAccess('readAny', 'doctor_profile'), user_controller.getUser,(req,res)=>{
        res.render('patient_profile',{data:req.user})
    })

//settings patient profile

profile
    .route('/patient_profile/settings_patient_profile/:id')
    .get(user_controller.allowIfLoggedin, user_controller.grantAccess('readOwn', 'patient_profile'), user_controller.getUser,(req,res)=>{
        res.render('settings_patient_profile',{data:req.user})
    })
    .post(user_controller.allowIfLoggedin,user_controller.grantAccess('updateOwn','patient_profile'),user_controller.updateUser)

profile
    .route('/patient_profile/previous_appointments/:id')
    .get(user_controller.allowIfLoggedin, user_controller.grantAccess('readOwn', 'patient_profile'), user_controller.getUser,(req,res)=>{
        res.render('previous_appointments',{data:req.user})
    })
    .post(user_controller.allowIfLoggedin, user_controller.grantAccess('updateOwn', 'patient_profile'), user_controller.updateUser)

//previous and future appointments
profile
    .route('/patient_profile/future_appointments/:id')
    .get(user_controller.allowIfLoggedin, user_controller.grantAccess('readAny', 'doctor_profile'), user_controller.getUser,(req,res)=>{
        res.render('future_appointments',{data:req.user})
    })
    

//doctor profile
profile
    .route('/doctor_profile/:id')
    .get(user_controller.allowIfLoggedin, user_controller.grantAccess('readAny','patient_profile'),user_controller.grantAccess('readAny','doctor_profile'), user_controller.getUser,(req,res)=>{
        res.render('doctor_profile',{data:req.user})
    })
    .post(user_controller.allowIfLoggedin,user_controller.grantAccess('updateOwn','doctor_profile'),user_controller.updateUser)
// TBD

module.exports = profile