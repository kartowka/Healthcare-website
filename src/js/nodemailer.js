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

module.exports.sendConfirmationEmail = (first_name,last_name, email, confirmationCode) => {
    transport.sendMail({
        from: user,
        to: email,
        subject: 'Please confirm your account',
        html: `<h1>Email Confirmation</h1>
        <h2>Hello ${first_name} ${last_name}</h2>
        <p>Thank you for registering to our HealthCare system. Please confirm your email by clicking on the following link</p>
        <a href=http://127.0.0.1:4000/confirm/${confirmationCode}> Click here</a>
        </div>`,
    }).catch(err => console.log(err))
}