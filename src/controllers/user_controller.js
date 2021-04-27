const User = require('../models/user_model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { roles } = require('../roles/roles')
const nodemailer = require('../js/nodemailer')
const alert = require('alert')

exports.grantAccess = function (action, resource) {
    return async (req, res, next) => {
        try {
            const permission = roles.can(req.user.role)[action](resource)
            if (!permission.granted) {
                alert('You don`t have enough permission to perform this action')
                return res.status(401).redirect('/')
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}
async function hashPassword(password) {
    return await bcrypt.hash(password, 10)
}

async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword)
}

async function lowerCaseEmail(email) {
    return String(email).toLowerCase()
}

exports.signup = async (req, res, next) => {
    try {
        const { first_name, last_name, email, password, role, clinic, medical_license_id, doctor_related_clinics } = req.body
        const hashedPassword = await hashPassword(password)
        const lowerCasedEmail = await lowerCaseEmail(email)
        const newUser = new User({ first_name, last_name, email: lowerCasedEmail, password: hashedPassword, role: role || 'patient', clinic, medical_license_id, doctor_related_clinics })
        const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })

        newUser.accessToken = accessToken
        await newUser.save((err) => {
            if (err) {
                res.status(500).send({ message: err })
                return
            }

            nodemailer.sendConfirmationEmail(
                newUser.first_name,
                newUser.last_name,
                newUser.email,
                newUser.accessToken,
                newUser.role
            )
            res.redirect('/')
        })

    } catch (error) {
        next(error)
    }
}

exports.login = async (req, res, next) => {
    try {

        const { email, password } = req.body
        const lowerCasedEmail = await lowerCaseEmail(email)
        const user = await User.findOne({ email: lowerCasedEmail })
        if (!user) {
            alert('Email does not exists!')
            return res.status(401).redirect(req.get('referer'))
        }
        const validPassword = await validatePassword(password, user.password)
        if (!validPassword) {
            alert('Password is not correct')
            return res.status(401).redirect(req.get('referer'))
        }
        if (user.status != 'Active' && user.status != 'Waiting for Admin Approval') {
            alert('Pending Account. Please Verify Your Email!')
            return res.status(401).redirect(req.get('referer'))
        }
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })
        let options = {
            path: '/',
            sameSite: true,
            maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
            httpOnly: true, // The cookie only accessible by the web server
        }
        res.cookie('x-access-token', accessToken, options)
        await User.findByIdAndUpdate(user._id, { accessToken })
        if (user.role == 'patient') {
            res.redirect(`/patient_profile/${user._id}`)
        } else if (user.role == 'doctor') {
            res.redirect(`/doctor_profile/${user._id}`)
        } else { res.redirect('/') }
    } catch (error) {
        next(error)
    }
}

exports.getUsers = async (req, res, next) => {
    const users = await User.find({})
    const relatedPage = req.path.split(/[/]/)
    res.status(200).render(relatedPage[1], { users })
}

exports.getUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const user = await User.findById(userId)
        if (!user) return next
        const relatedPage = req.path.split(/[/]/)
        if (res.locals.loggedInUser.status == 'Waiting for Admin Approval') {
            alert('An admin sill hasn`t authorized you yet, please wait patiently')
            return res.status(401).redirect('/')
        }
        res.status(200).render(relatedPage[1], { data: user })

    } catch (error) {
        next(new Error('User does not exist'))
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const update = req.body
        const userId = req.params.id
        await User.findByIdAndUpdate(userId, update)
        const user = await User.findById(userId)
        alert('User has been updated')
        res.status(200).redirect(req.get('referer'))
    } catch (error) {
        next(error)
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        await User.findByIdAndDelete(userId)
        res.status(200).redirect(req.get('referer'))
    } catch (error) {
        next(error)
    }
}

exports.allowIfLoggedin = async (req, res, next) => {
    try {
        const user = res.locals.loggedInUser
        if (!user) {
            alert('You need to be logged in to access this route')
            return res.status(401).redirect(req.get('referer'))
        }
        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}

exports.verifyUser = (req, res, next) => {
    User.findOne({ accessToken: req.params.confirmationCode })
        .then((user) => {
            if (!user) {
                alert('User not found!')
                return res.status(404).redirect(req.get('referer'))
            }

            if (user.role == 'doctor') {
                user.status = 'Waiting for Admin Approval'
            } else user.status = 'Active'

            res.redirect('/')
            user.save((err) => {
                if (err) {
                    res.status(500).send({ message: err })
                    return
                }
            })
        })
        .catch((e) => console.log('error', e))
}

exports.verifyDoctor = (req, res, next) => {

    User.findOne({ _id: req.params.id })
        .then(async(user) => {
            nodemailer.sendAuthenticationApprovalToDoctor(
                user.last_name,
                user.email,
                user._id
            )
            await User.updateOne({ _id: user._id }, { $set: { status: 'Active' } })
            //console.log(req)
            res.redirect(req.get('referer'))
        })
        .catch((e) => console.log('error', e))
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
        .then((user) => {
            if (!user) {
                alert('User not found')
                return res.status(404).redirect(req.get('referer'))
            }
            const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '20m' })
            nodemailer.sendResetPassword(
                user.first_name,
                user.last_name,
                user.email,
                accessToken
            )
            res.redirect('/')
            user.save((err) => {
                if (err) {
                    res.status(500).send({ message: err })
                    return
                }
            })
        })
        .catch((e) => console.log('error', e))
}
exports.passwordReset = async (req, res) => {
    try {
        const { accessToken } = req.params
        if (accessToken) {
            const verified = jwt.verify(accessToken, process.env.JWT_SECRET)
            if (verified) {
                const { newPassword, confirmPassword } = req.body
                const user = await User.findById(verified.userId)
                if (newPassword === confirmPassword) {
                    const hashedPassword = await hashPassword(newPassword)
                    await User.updateOne({ _id: user._id }, { $set: { password: hashedPassword } }, { new: true })
                    alert('Password changed successfully')
                    res.status(201).redirect(req.get('referer'))
                } else {
                    alert('Confirm password does not match')
                    res.status(401).redirect(req.get('referer'))
                }
            } else {
                alert('Invalid accessToken')
                res.status(401).redirect(req.get('referer'))
            }
        } else {
            alert('accessToken not found')
            res.status(401).redirect(req.get('referer'))
        }
    } catch (error) {
        alert(error.message)
        res.status(401).redirect(req.get('referer'))
    }
}
