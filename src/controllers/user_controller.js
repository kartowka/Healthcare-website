const User = require('../models/user_model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { roles } = require('../roles/roles')
const nodemailer = require('../js/nodemailer')
const DoctorDetails = require('../models/doctor_model')

exports.grantAccess = function (action, resource) {
  return async (req, res, next) => {
    try {
      var granted = true
      const user = await User.findById(req.params.id)
      if (
        req.user.id != user.id &&
        user.role == 'patient' &&
        req.user.role == 'patient'
      )
        granted = false
      else if (
        req.user.id != user.id &&
        user.role == 'doctor' &&
        req.user.role == 'doctor' &&
        resource != 'doctor_profile'
      )
        granted = false
      var permission = roles.can(req.user.role)[action](resource)
      if (!permission.granted || !granted) {
        throw new Error('You are not allowed to perform this action.')
      }
      next()
    } catch (error) {
      res.status(401)
      req.error = { Message: error, statusCode: '401' }
      next()
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
    const {
      first_name,
      last_name,
      email,
      password,
      role,
      clinic,
      medical_license_id,
      doctor_related_clinics,
    } = req.body

    const hashedPassword = await hashPassword(password)
    const lowerCasedEmail = await lowerCaseEmail(email)
    const newUser = new User({
      first_name,
      last_name,
      email: lowerCasedEmail,
      password: hashedPassword,
      role: role || 'patient',
      clinic,
    })
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    )

    newUser.accessToken = accessToken
    newUser.save(async (err) => {
      var msg
      if (err) {
        if (
          await DoctorDetails.exists({ medical_license_id: medical_license_id })
        ) {
          msg = 'User & License ID already exist in the database'
        } else {
          msg = 'User already exists in the database'
        }
        req.error = {
          Message: msg,
          statusCode: '401',
        }
        res.status(401)
        next()
      } else {
        if (newUser.role == 'doctor') {
          const doctor_details = new DoctorDetails({
            _doctor_id: newUser._id,
            medical_license_id,
            doctor_related_clinics,
          })
          await doctor_details.save()
        }
        nodemailer.sendConfirmationEmail(
          newUser.first_name,
          newUser.last_name,
          newUser.email,
          newUser.accessToken,
          newUser.role
        )
        req.error = {
          Message: 'Email confirmation has been sent.',
          statusCode: '200',
        }
        res.status(200)
        next()
      }
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
      throw new Error('Email does not exists!')
    }
    const validPassword = await validatePassword(password, user.password)
    if (!validPassword) {
      throw new Error('Password is not correct.')
    }
    if (user.status != 'Active') {
      throw new Error('Pending Account. Please Verify Your Email!')
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
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
      res.redirect(`/doctor_profile/doctor_settings/${user._id}`)
    } else {
      res.redirect('/')
    }
  } catch (error) {
    req.error = { Message: error, statusCode: '401' }
    res.status(401)
    next()
  }
}

exports.getUsers = async (req, res, next) => {
  const users = await User.find({})
  req.params.users = users
  next()
}

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.id
    const user = await User.findById(userId)
    if(user.role == 'doctor'){
      let details = await DoctorDetails.find({ _doctor_id : userId })
      req.doctor_details = details[0]
    }
    if (!user) {
      throw new Error('User does not exist')
    }
    req.user = user
    next()
  } catch (error) {
    req.error = { Message: error, statusCode: '401' }
    res.status(401)
    next()
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    let update = req.body
    let userId = req.params.id
    let user = await User.findById(userId)
    
    if (update.first_name != undefined) {
      if (update.first_name && update.last_name) {
        let userUpdate = await User.findByIdAndUpdate(userId, update)
        if (user.role == 'doctor'){
          let details = await DoctorDetails.findOne({ _doctor_id : userId })
          let userUpdateDoctor = await DoctorDetails.findByIdAndUpdate(details._id, update)
        }
        throw 'User has been updated'
      } else throw new Error('No updated, missing data in one of the fields')
    }
    if (user.role == 'doctor') {
      let details = await DoctorDetails.findOne({ _doctor_id : userId })
      if(update.working_days != undefined || update.bio != undefined){
        const userUpdate = await DoctorDetails.findByIdAndUpdate(details._id, update)
        throw 'User has been updated'
      }
      if(update.start_time != undefined && update.end_time != undefined){
        const userUpdate = await DoctorDetails.findByIdAndUpdate(details._id, update)
        throw 'User has been updated'
      }
      if(update.city != undefined && update.street != undefined){
        if(details.clinic_address != undefined){
          console.log('!!!!')
          await DoctorDetails.findOneAndUpdate(
            { '_id': details._id,'clinic_address._id': details.clinic_address._id },
            {
              $set: {
                'clinic_address.city': update.city,
                'clinic_address.street': update.street,
              },
            },
            { new: true }
          )
        }
        else{
          await DoctorDetails.findByIdAndUpdate(details._id,{
            $set: {
              clinic_address: {
                city: update.city,
                street: update.street,
              }
            }
          },
            {new : true}
          )
        }
        throw 'User has been updated'
      }
      if (update.first_name != undefined && update.last_name != undefined) {
        const userUpdate = await User.findByIdAndUpdate(userId, update)
        const details = await DoctorDetails.find({ _doctor_id : userId })
        const userUpdateDoctor = await DoctorDetails.findByIdAndUpdate(details._id, update)
        throw 'User has been updated'
      }
      //else throw new Error('No updated, missing data in one of the fields')

 
    }
  } catch (error) {
    req.error = { Message: error, statusCode: '200' }
    res.status(200)
    next()
  }
}



exports.deleteUser = async (req, res) => {
  try {
    const userId = req.body.delete_ID
    const user = await User.findById((userId))
    if (user.role == 'doctor') {
      await DoctorDetails.findOneAndDelete({ _doctor_id: userId })
    }
    await User.findByIdAndDelete(userId)
    throw 'User has been deleted.'
  } catch (error) {
    req.error = { Message: error, statusCode: '200' }
    res.status(200)
    res.redirect(req.get('referer'))
  }
}

exports.allowIfLoggedin = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser
    if (!user) {
      throw new Error('You need to be logged in to access this route')
    }
    req.user = user
    next()
  } catch (error) {
    req.error = { Message: error, statusCode: '401' }
    res.status(401)
    next()
  }
}

exports.denyIfLoggedin = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser
    if (user) {
      throw new Error('You already loggedin.')
    } else {
      next()
    }
  } catch (error) {
    res.status(401)
    req.error = { Message: error, statusCode: '401' }
    next()
  }
}

exports.verifyUser = (req, res, next) => {
  User.findOne({ accessToken: req.params.confirmationCode })
    .then((user) => {
      if (!user) {
        throw new Error('User not found!')
      }

      if (user.role == 'doctor') {
        user.status = 'Waiting for Admin Approval'
      } else user.status = 'Active'
      res.redirect('/login')
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err })
          return
        }
      })
    })
    .catch((error) => {
      req.error = { Message: error, statusCode: '401' }
      res.status(401)
      next()
    })
}

exports.verifyDoctor = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.approve_ID })
    if (user) {
      nodemailer.sendAuthenticationApprovalToDoctor(
        user.last_name,
        user.email,
        user._id
      )
    }
    await User.updateOne({ _id: user._id }, { $set: { status: 'Active' } })
    throw 'Doctor has been approved.'
  } catch (error) {
    req.error = { Message: error, statusCode: '200' }
    res.status(200)
    res.redirect(req.get('referer'))
    //TODO maybe delete
  }
}