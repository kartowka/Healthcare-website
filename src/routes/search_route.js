const express = require('express')
const router = express.Router()
const user_controller = require('../controllers/user_controller')
const User = require('../models/user_model')

router
    .route('/')
    .get(
        user_controller.allowIfLoggedin,
        user_controller.getUsers,
        async (req, res) => {
            try {
                const {
                    term
                } = req.query
                const user = await User.find({
                    first_name: {
                        '$regex': term,
                        '$options': 'i'
                    }
                })
                res.render('search', {
                    users: user
                })
            } catch (e) {
                res.render('search', {
                    users: ''
                })
            }
        })
module.exports = router