const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')
const passport = require('passport')

// is authenticated
const { forwardAuthenticated } = require('../config/auth')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('reports', {
    title: 1,
    reportContent: 1,
    date: 1
  })
  response.json(users)
})

usersRouter.get('/login', forwardAuthenticated, (req, res) => {
  res.render('login')
})

usersRouter.get('/signup', forwardAuthenticated, (req, res) => {
  res.render('signup')
})

usersRouter.post('/signup', (request, response) => {
  const { body } = request
  const { name, email, password, password2 } = body
  const errors = []

  // check req fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'complete all fields' })
  }

  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' })
  }

  // check pass length
  if (password.length < 6) {
    errors.push({ msg: 'Passwords should be at least 6 characters' })
  }

  if (errors.length > 0) {
    response.render('signup', {
      errors,
      name,
      email,
      password,
      password2
    })
  } else {
    // create a new instance of user
    User.findOne({ email }).then((user) => {
      if (user) {
        errors.push({ msg: 'Email is already submitted' })
        response.render('signup', {
          errors,
          name,
          email,
          password,
          password2
        })
      } else {
        const newUser = new User({
          name,
          email,
          passwordHash: password
        })
        //  hasg password
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        // set password to hash
        newUser.passwordHash = hash
        // save user
        newUser
          .save()
          .then((user) => {
            request.flash(
              'success_msg',
              'You are now registered, and can log in'
            )
            response.redirect('/users/login')
          })
          .catch((err) => console.error(err))
      }
    })
  }
})

usersRouter.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/overview',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next)
})

// Logout
usersRouter.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    req.flash('success_msg', 'You are logged out')
    res.redirect('../users/login')
  })
})

module.exports = usersRouter
