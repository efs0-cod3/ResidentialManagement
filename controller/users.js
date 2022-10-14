const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')
const passport = require('passport')

// is authenticated
// const { forwardAuthenticated } = require('../config/auth')

// reports
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('reports', {
    title: 1,
    reportContent: 1,
    date: 1
  })
  response.json(users)
})

// Log In
usersRouter.get('/login', (request, response) => {
  if (request.session.id || request.user) {
    response.redirect('/reports')
  }
  response.render('login', {
    title: 'Login'
  })
})

usersRouter.post('/login', (req, res, next) => {
  // passport.authenticate('local', {
  //   successRedirect: req.session.returnTo || '/reports',
  //   failureRedirect: '/users/login',
  //   failureFlash: true
  // })(req, res, next)

  console.log(`here ${req.session.id}`)
  passport.authenticate('local', (err, user) => {
    if (err) { return next(err) }
    if (!user) {
      req.flash('error_msg', 'Missing Credentials.')
      return res.redirect('/login')
    }
    req.logIn(user, (err) => {
      if (err) { return next(err) }
      req.flash('success_msg', 'Success! You are logged in.')
      res.redirect(req.session.returnTo || '/reports')
    })
  })(req, res, next)
})

// Sign up
usersRouter.get('/signup', (request, response) => {
  if (request.user) {
    return response.redirect('/reports')
  }
  response.render('signup', {
    title: 'Create Account'
  })
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
            response.redirect('/login')
          })
          .catch((err) => console.error(err))
      }
    })
  }
})

// Logout
usersRouter.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    req.session.destroy()
    res.redirect('/login')
  })
})

module.exports = usersRouter
