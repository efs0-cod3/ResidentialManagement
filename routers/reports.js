require('dotenv').config() // as early as posible
const reportRouter = require('express').Router()
const Report = require('../models/Report')
// const User = require('../models/User')
const { ensureAuthenticated } = require('../config/auth')

// const userExtractor = require('../middleWare/userExtractor')

// render on overview ejs
reportRouter.get('/overview', ensureAuthenticated, (req, response) => {
  Report.find({})
    .then((reports) => {
      response.render('overview', {
        reports
      })
    })
    .catch((err) => console.error(err))
})

// reportRouter.get('/myReports', async (req, response) => {
//   const reports = await Report.find({}).populate('user', {
//     email: 1,
//     name: 1
//   })
//   response.json(reports)
// })

reportRouter.post('/overview', async (request, response) => {
  const {
    title,
    reportContent,
    date
  } = request.body

  if (!title || !reportContent) {
    return
  }

  const newReport = new Report({
    title,
    reportContent,
    date
  })

  newReport.save().then(user => {
    response.redirect('/overview')
  })
})

module.exports = reportRouter
