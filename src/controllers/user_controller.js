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
            if (!permission.granted)
                return res.status(401).json({
                    error: 'You don`t have enough permission to perform this action'
                })
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

        if (role == 'doctor' && medical_license_id == '') throw 'You have to fill in your license id'

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
        if (!user) return next(new Error('Email does not exist'))
        const validPassword = await validatePassword(password, user.password)
        if (!validPassword) return next(new Error('Password is not correct'))
        if (user.status != 'Active' && user.status != 'Waiting for Admin Approval') {
            return res.status(401).send({
                message: 'Pending Account. Please Verify Your Email!',
            })
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
    res.status(200).json({
        data: users
    })
}

exports.getUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const user = await User.findById(userId)
        if (!user) return next
        const relatedPage = req.path.split(/[/]/)
        res.status(200).render(relatedPage[1],{data:user})
        
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
        alert('user has been updated.')
        res.status(200).redirect('/')
    } catch (error) {
        next(error)
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.userId
        await User.findByIdAndDelete(userId)
        res.status(200).json({
            data: null,
            message: 'User has been deleted'
        })
    } catch (error) {
        next(error)
    }
}

exports.allowIfLoggedin = async (req, res, next) => {
    try {
        const user = res.locals.loggedInUser
        if (!user)
            return res.status(401).json({
                error: 'You need to be logged in to access this route'
            })
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
                return res.status(404).send({ message: 'User Not found.' })
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

exports.forgotPassword = async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(404).send({ message: 'User Not found.' })
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
                    res.status(201).json({ success: true, message: 'Password changed successfully' })
                } else {
                    res.status(401).json({ success: false, message: 'Confirm password does not match' })
                }
            } else {
                res.status(401).json({ success: false, message: 'Invalid accessToken' })
            }
        } else {
            res.status(401).json({ success: false, message: 'accessToken not found' })
        }
    } catch (error) {
        res.status(401).json({ success: false, message: error.message })
    }
}
