const indexRouter = require('express').Router()

indexRouter.get('/', (req, res) => {
  res.render('index')
})

indexRouter.get('/login', (req, res) => {
  res.render('login')
})

indexRouter.get('/signup', (req, res) => {
  res.render('signup')
})

module.exports = indexRouter
