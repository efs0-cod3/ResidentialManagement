const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

// load user model
const User = require('../models/User')

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, passwordHash, done) => {
      User.findOne({ email: email.toLowerCase() })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: `Email ${email} not found`
            })
          }
          // match password
          bcrypt.compare(passwordHash, user.passwordHash, (err, isMatch) => {
            if (err) throw err

            if (isMatch) {
              return done(null, user)
            } else {
              return done(null, false, { message: 'Invalid email or password' })
            }
          })
        })
        .catch((err) => console.log(err))
    })
  )
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}
