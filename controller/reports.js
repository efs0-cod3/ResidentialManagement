require('dotenv').config() // as early as posible
const reportRouter = require('express').Router()
const ObjectId = require('mongodb').ObjectID
const Report = require('../models/Report')
// const ROLE = require('../config/roles')
const User = require('../models/User')
const { ensureAuthenticated } = require('../config/auth')

// const userExtractor = require('../middleWare/userExtractor')

// render on overview ejs
reportRouter.get('/overview', ensureAuthenticated, (request, response) => {
  Report.find({})
    .then((reports) => {
      response.render('overview', {
        userId: request.user._id,
        name: request.user.name,
        reports
      })
    })
    .catch((err) => console.error(err))
})

reportRouter.post('/overview', ensureAuthenticated, async (request, response) => {
  const {
    title,
    reportContent,
    date
  } = request.body

  const userId = request.user.id

  const user = await User.findById(userId)

  if (!title || !reportContent) {
    return
  }

  const newReport = new Report({
    title,
    reportContent,
    date,
    user: user._id
  })

  try {
    const savedReport = await newReport.save()

    user.reports = user.reports.concat(savedReport._id)
    await user.save()
    response.redirect('/overview')
  } catch (error) {
    console.log(error)
  }
})

reportRouter.get('/viewReport/:id', async (request, response) => {
  const { id } = request.params

  try {
    const report = await Report.findById({ _id: ObjectId(id) })
    response.render('viewReport', {
      report
    })
  } catch (error) {
    console.log(error)
  }
})

module.exports = reportRouter
