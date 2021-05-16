const User = require('../models/user_model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { roles } = require('../roles/roles')
const nodemailer = require('../js/nodemailer')
const DoctorDetails = require('../models/doctor_model')


exports.make_an_Appointment = async (req, res, next) => {
    try {
        let update = req.body
        let userId = req.params.id
        let user = await User.findById(userId)
        if(user.role == 'doctor'){
            let details = await DoctorDetails.findOne({ _doctor_id : userId })
            let appointment_list = []
            let start = details.start_day.replace(':', '');
            let end = details.end_day


            // for(let i = 0; i<details.working_days; ++i){
            //     appointment_list[i] = []
            //     for(let j = details.start_day; j < details.end_day; j+15){
            //         appointment_list[i][j]
            //     }
                
            // }
            
        }
    
    } catch (error) {
        req.error = { Message: error, statusCode: '200' }
        res.status(200)
        res.redirect(req.get('referer'))
    }
}
