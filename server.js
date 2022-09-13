
require('ejs')

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
// const MongoStore = require('connect-mongodb-session')(session)
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const logger = require('morgan')
const methodOverride = require('method-override')
const connectDB = require('./config/database')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')

require('dotenv').config({ path: './config/.env' }) // as early as posible

// passport config
require('./config/passport')(passport)

connectDB()

const reportsRouter = require('./controller/reports')
const usersRouter = require('./controller/users')
const indexRouter = require('./controller/index')

app.use(cors()) // cross origin sharing
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(logger('dev'))
// Body parser
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
// Use forms for put / delete
app.use(methodOverride('_method'))

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      collection: 'sessions'
    }),
    cookie: {
      maxAge: 1000 * 60 * 600 * 24
    }
  })
)

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect flash
app.use(flash())

app.use(function (req, res, next) {
  console.log(req.session)
  console.log('++++++++++++++')
  console.log(req.session.id)
  console.log('++++++++++++++')
  console.log(req.user)
  next()
}
)

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
app.use('/reports', reportsRouter)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`app listening on port ${PORT}!`))
