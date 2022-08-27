
require('dotenv').config() // as early as posible
require('./mongo')
require('ejs')

const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

// passport config
require('./config/passport')(passport)

const reportsRouter = require('./controller/reports')
const usersRouter = require('./controller/users')
const indexRouter = require('./controller/index')

app.use(cors()) // cross origin sharing
app.use(express.json())
app.use(express.static('public'))
// Body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')

// express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect flash
app.use(flash())

// global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

// routes
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/', reportsRouter)
// app.use('/login', loginRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`app listening on port ${PORT}!`))
