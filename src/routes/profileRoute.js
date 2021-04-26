const express = require('express')
const router = require('./route')
const profile = express.Router()
const userController = require('../controllers/userController')



//pateint profile
profile
.route('/patientProfile')
.get(userController.allowIfLoggedin,function (req, res) {
    res.render('patientProfile')
})
profile
.route('/patientProfile/previousAppointments')
.get(userController.allowIfLoggedin,function (req, res) {
    res.render('previousAppointments')
})

//future appointments
profile
.route('/patientProfile/futureAppointments')
.get(userController.allowIfLoggedin,function (req, res) {
    res.render('futureAppointments')
})

//doctor profile
profile
.route('/doctorProfile')
.get(userController.allowIfLoggedin,function (req, res) {
    res.render('doctorProfile')
})

module.exports = profile