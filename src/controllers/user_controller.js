const User = require('../models/user_model')
const Doctor = require('../models/doctor_model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { roles } = require('../roles/roles')
const nodemailer = require('../js/nodemailer')

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
      req.app.locals.errors.push(error)
      return res.status(401).redirect('/restricted')
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
    var doctor
    const newUser = new User({
      first_name,
      last_name,
      email: lowerCasedEmail,
      password: hashedPassword,
      role: role || 'patient',
      clinic,
      medical_license_id,
      doctor_related_clinics,
    })
    // if(newUser.role == 'doctor'){
    //     doctor = new Doctor({medical_license_id,doctor_related_clinics})
    //     await doctor.save()
    // }    //sprint4
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    )

    newUser.accessToken = accessToken
    await newUser.save((err) => {
      if (err) {
        req.app.locals.errors.push('user already exist in the system')
        return res.status(401).redirect('/restricted')
      }

      nodemailer.sendConfirmationEmail(
        newUser.first_name,
        newUser.last_name,
        newUser.email,
        newUser.accessToken,
        newUser.role
      )
      req.app.locals.errors.push('Email confirmation has been sent.')
      next()
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
    req.app.locals.errors.push(error)
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
    if (!user) {
      throw new Error('User does not exist')
    }
    req.user = user
    next()
  } catch (error) {
    req.app.locals.errors.push(error)
    next()
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    const update = req.body
    const userId = req.params.id
    await User.findByIdAndUpdate(userId, update)
    if (update.first_name && update.last_name) {
      const user = await User.findById(userId)
      throw 'User has been updated'
    } else throw new Error('No updated, missing data in one of the fields')
  } catch (error) {
    req.app.locals.errors.push(error)
    next()
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
      throw new Error('You need to be logged in to access this route')
    }
    req.user = user
    next()
  } catch (error) {
    req.app.locals.errors.push(error)
    return res.status(401).redirect('/restricted')
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
    .catch((e) => {
      req.app.locals.errors.push(e)
      return res.status(401).redirect('/restricted')
    })
}

exports.verifyDoctor = (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .then(async (user) => {
      nodemailer.sendAuthenticationApprovalToDoctor(
        user.last_name,
        user.email,
        user._id
      )
      await User.updateOne({ _id: user._id }, { $set: { status: 'Active' } })
      //console.log(req)
      res.redirect(req.get('referer'))
    })
    .catch((e) => {
      req.app.locals.errors.push(e)
      return res.status(401).redirect('/restricted')
    })
}

exports.forgotPassword = async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })
    .then((user) => {
      if (!user) {
        throw new Error('User not found')
      }
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '20m' }
      )
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
    .catch((e) => {
      req.app.locals.errors.push(e)
      return res.status(401).redirect('/restricted')
    })
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
          await User.updateOne(
            { _id: user._id },
            { $set: { password: hashedPassword } },
            { new: true }
          )
          throw 'Password changed successfully'
        } else {
          throw new Error('Confirm password does not match')
        }
      } else {
        throw new Error('Invalid accessToken')
      }
    } else {
      throw new Error('accessToken not found')
    }
  } catch (error) {
    req.app.locals.errors.push(error)
    return res.status(401).redirect('/restricted')
  }
}
//TODO getInsurancePolicy && paymentConfirm //
// exports.getInsurancePolicy = async (req, res, next) => {
//   try {
//     const {
//       plan,
//       country,
//       daterange,
//       first_name,
//       last_name,
//       email,
//       id,
//       card_holder_name,
//       card_holder_number,
//       card_holder_card_expiredate,
//       card_holder_card_security_code,
//     } = req.body
//     const lowerCasedEmail = await lowerCaseEmail(email)
//     await this.paymentConfirmation(card_holder_name,card_holder_number,card_holder_card_expiredate,card_holder_card_security_code)
//     const newInsurace = new User({
//       first_name,
//       last_name,
//       email: lowerCasedEmail,
//       password: hashedPassword,
//       role: role || 'patient',
//       clinic,
//       medical_license_id,
//       doctor_related_clinics,
//     })
//     const accessToken = jwt.sign(
//       { userId: newUser._id },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: '1d',
//       }
//     )

//     newUser.accessToken = accessToken
//     await newUser.save((err) => {
//       if (err) {
//         req.app.locals.errors.push('user already exist in the system')
//         return res.status(401).redirect('/restricted')
//       }

//       nodemailer.sendConfirmationEmail(
//         newUser.first_name,
//         newUser.last_name,
//         newUser.email,
//         newUser.accessToken,
//         newUser.role
//       )
//       req.app.locals.errors.push('Email confirmation has been sent.')
//       next()
//     })
//   } catch (error) {
//     next(error)
//   }
// }
// async function paymentConfirmation(name,card_number,card_expiredate,card_securitycode) {
  
//   return true
// }
