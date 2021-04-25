const nodemailer = require('nodemailer')
const config = require('../.env')

const user = config.EMAIL_USERNAME
const pass = config.EMAIL_PASSWORD

const transport = nodemailer.createTransport({
    host: 'smtp.mail.yahoo.com',
    port: 465,
    service: 'yahoo',
    secure: false,
    auth: {
        user: user,
        pass: pass,
    },
})

module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
    console.log('Check')
    transport.sendMail({
        from: user,
        to: email,
        subject: 'Please confirm your account',
        html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=http://localhost:8081/confirm/${confirmationCode}> Click here</a>
        </div>`,
    }).catch(err => console.log(err))
}