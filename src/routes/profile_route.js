const express = require('express')
const profile = express.Router()
const user_controller = require('../controllers/user_controller')


//pateint profile
profile
    .route('/patient_profile/:id')
    .get(user_controller.allowIfLoggedin,
        user_controller.grantAccess('readOwn', 'patient_profile'),
        user_controller.getUser, (req, res) => {
            res.render('patient_profile', { data: req.user })
        })

//settings patient profile
profile
    .route('/patient_profile/patient_settings/:id')
    .get(user_controller.allowIfLoggedin,
        user_controller.grantAccess('readOwn', 'patient_settings'), //check
        user_controller.getUser, (req, res) => {
            res.render('patient_settings', { data: req.user })
        })
    .post(user_controller.allowIfLoggedin,
        user_controller.grantAccess('updateOwn', 'patient_settings'),
        user_controller.updateUser)

profile
    .route('/patient_profile/patient_previous_appointments/:id')
    .get(user_controller.allowIfLoggedin,
        user_controller.grantAccess('readOwn', 'patient_previous_appointments'),
        user_controller.getUser, (req, res) => {
            res.render('patient_previous_appointments', { data: req.user })
        })
    .post(user_controller.allowIfLoggedin,
        user_controller.grantAccess('updateOwn', 'patient_previous_appointments'),
        user_controller.updateUser)

//previous and future appointments
profile
    .route('/patient_profile/patient_future_appointments/:id')
    .get(user_controller.allowIfLoggedin,
        user_controller.grantAccess('readOwn', 'patient_future_appointments'),
        user_controller.getUser, (req, res) => {
            res.render('patient_future_appointments', { data: req.user })
        })

//doctor profile
profile
    .route('/doctor_profile/:id')
    .get(user_controller.allowIfLoggedin,
        user_controller.grantAccess('readAny', 'doctor_profile'),
        user_controller.getUser, (req, res) => {
            res.render('doctor_profile', { data: req.user })
        })

//doctor settings
profile
    .route('/doctor_profile/doctor_settings/:id')
    .get(user_controller.allowIfLoggedin,
        user_controller.grantAccess('readOwn', 'doctor_settings'),
        user_controller.getUser, (req, res) => {
            res.render('doctor_settings', { data: req.user })
        })
    .post(user_controller.allowIfLoggedin,
        user_controller.grantAccess('updateOwn', 'doctor_settings'),
        user_controller.updateUser)

//previous and future appointments
profile
    .route('/doctor_profile/doctor_future_appointments/:id')
    .get(user_controller.allowIfLoggedin,
        user_controller.grantAccess('readOwn', 'doctor_future_appointments'),
        user_controller.getUser, (req, res) => {
            res.render('doctor_future_appointments', { data: req.user })
        })

profile
    .route('/doctor_profile/doctor_previous_appointments/:id')
    .get(user_controller.allowIfLoggedin,
        user_controller.grantAccess('readOwn', 'doctor_previous_appointments'),
        user_controller.getUser, (req, res) => {
            res.render('doctor_previous_appointments', { data: req.user })
        })

// doctor Appointment summary   
profile
    .route('/doctor_profile/doctor_appointment_summary/:id')
    .get(user_controller.allowIfLoggedin,
        user_controller.grantAccess('readOwn', 'doctor_appointment_summary'),
        user_controller.getUser, (req, res) => {
            res.render('doctor_appointment_summary', { data: req.user })
        })

// doctor Reviwe   
profile
    .route('/doctor_profile/doctor_Review/:id')
    .get(user_controller.allowIfLoggedin,
        user_controller.grantAccess('readOwn', 'doctor_Review'),
        user_controller.getUser, (req, res) => {
            res.render('doctor_Review', { data: req.user })
        })

module.exports = profile