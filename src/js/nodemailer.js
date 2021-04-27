const nodemailer = require('nodemailer')
const path = require('path')
const config = require('dotenv').config({
    path: path.join(__dirname, '../.env')
  })

const user = config.parsed.EMAILUSERNAME
const pass = config.parsed.EMAILPASS

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
        <a href=http://127.0.0.1:4000/confirm/${confirmationCode}> Click here</a>
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
        <a href=http://127.0.0.1:4000/confirm/${confirmationCode}> Click here</a>
        </div>`,
        }).catch(err => console.log(err))
    }
}

module.exports.sendAuthenticationApprovalToDoctor = (last_name, email, id) => {

    transport.sendMail({
        from: user,
        to: email,
        subject: 'You Have Been Authenticated',
        html: `<h1>Email Confirmation</h1>
        <h2>Hello Dr.${last_name}</h2>
        <p>You have been authenticated by our admin, you can keep using our system with full doctor privileges</p>
        <a href=http://127.0.0.1:4000/doctor_profile/:${id}> Click here</a>
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
        <a href=http://127.0.0.1:4000/reset_password/${confirmationCode}> Click here</a>
        </div>`,
    }).catch(err => console.log(err))
}