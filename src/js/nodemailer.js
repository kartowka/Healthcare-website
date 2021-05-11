const nodemailer = require('nodemailer')
const path = require('path')
const config = require('dotenv').config({
    path: path.join(__dirname, '../.env')
  })

const user = config.parsed.EMAILUSERNAME
const pass = config.parsed.EMAILPASS
var link = config.parsed.WEBSITEURL

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: user,
        pass: pass,
    },
})

module.exports.sendConfirmationEmail = (first_name,last_name, email, confirmationCode, role) => {
    if (role == 'doctor'){
        transport.sendMail({
            from: user,
            to: email,
            subject: 'Activate Your Account',
            html: `<h1>Email Confirmation</h1>
        <h2>Hello Dr.${last_name}</h2>
        <p>Thank you for registering to our HealthCare system. Please confirm your email by clicking on the following link</p>
        <a href=${link}/confirm/${confirmationCode}> Click here</a>
        <p>Please wait for an Admin to authenticate your credentials afterwards</p>
        </div>`,
        }).catch(err => console.log(err))
    } else {
        transport.sendMail({
            from: user,
            to: email,
            subject: 'Activate Your Account',
            html: `<h1>Email Confirmation</h1>
        <h2>Hello ${first_name} ${last_name}</h2>
        <p>Thank you for registering to our HealthCare system. Please confirm your email by clicking on the following link</p>
        <a href=${link}/confirm/${confirmationCode}> Click here</a>
        </div>`,
        }).catch(err => console.log(err))
    }
}

module.exports.sendAuthenticationApprovalToDoctor = (last_name, email, user_id) => {
    transport.sendMail({
        from: user,
        to: email,
        subject: 'You Have Been Authenticated',
        html: `<h1>Email Confirmation</h1>
        <h2>Hello Dr.${last_name}</h2>
        <p>You have been authenticated by our admin, you can keep using our system with full doctor privileges</p>
        <a href=${link}> Click here</a>
        </div>`,
    }).catch(err => console.log(err))
}

module.exports.sendResetPassword = (first_name,last_name, email, confirmationCode) => {
    transport.sendMail({
        from: user,
        to: email,
        subject: 'Password Reset',
        html: `<h1>Reset Password</h1>
        <h2>Hello ${first_name} ${last_name}</h2>
        <p>To reset your password, complete this form:</p>
        <a href=${link}/reset_password/${confirmationCode}> Click here</a>
        </div>`,
    }).catch(err => console.log(err))
}
module.exports.sendConfirmationEmailInsurancePolicy = (first_name,last_name,email,id,Insurance_type,dates,insurance_reference) => {
    transport.sendMail({
        from: user,
        to: email,
        subject: `Confirmation Mail for ${id}`,
        html: `<h1>Confirmation Mail - Insurance Policy</h1>
        <h2>Hello ${first_name} ${last_name}</h2>
        <p>this is a confirmation email about your insurance policy for <strong> ${dates.start_date} - ${dates.end_date} </strong>,</p>
        <p>insurance type <strong> ${Insurance_type} </strong>,</p>
        <p>this is your reference <strong> ${insurance_reference} </strong>,</p>
        <p>safe flight!</p>
        </div>`,
    }).catch(err => console.log(err))
}