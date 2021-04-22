// server/controllers/userController.js
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { roles } = require('../roles/roles')

exports.grantAccess = function (action, resource) {
    return async (req, res, next) => {
        try {
            const permission = roles.can(req.user.role)[action](resource)
            if (!permission.granted) {
                return res.status(401).json({
                    error: 'You don`t have enough permission to perform this action'
                })
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

module.exports.signup = async (req, res, next) => {
    try {
        console.log(req.body)
        const { first_name, last_name, email, password, role, clinic, medical_license_id, doctor_related_clinics } = req.body
        if (password != req.body.password_repeat) throw 'Passwords do not match'
        const hashedPassword = await hashPassword(password)
        const newUser = new User({ first_name, last_name, email, password: hashedPassword, role: role || 'patient', clinic, medical_license_id, doctor_related_clinics })
        const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })
        newUser.accessToken = accessToken
        await newUser.save()
        res.json({
            data: newUser,
            accessToken
        })
    } catch (error) {
        next(error)
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) return next(new Error('Email does not exist'))
        const validPassword = await validatePassword(password, user.password)
        if (!validPassword) return next(new Error('Password is not correct'))
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })
        await User.findByIdAndUpdate(user._id, { accessToken })
        res.status(200).json({
            data: { email: user.email, role: user.role },
            accessToken
        })
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
        const userId = req.params.userId
        const user = await User.findById(userId)
        if (!user) return next(new Error('User does not exist'))
        res.status(200).json({
            data: user
        })
    } catch (error) {
        next(error)
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const update = req.body
        const userId = req.params.userId
        await User.findByIdAndUpdate(userId, update)
        const user = await User.findById(userId)
        res.status(200).json({
            data: user,
            message: 'User has been updated'
        })
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