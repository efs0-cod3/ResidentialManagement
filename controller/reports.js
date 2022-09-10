require('dotenv').config() // as early as posible
const reportRouter = require('express').Router()
// const ObjectId = require('mongodb').ObjectID
const Report = require('../models/Report')
// const ROLE = require('../config/roles')
const User = require('../models/User')
const { ensureAuthenticated } = require('../config/auth')

// render on overview ejs
reportRouter.get('/', ensureAuthenticated, (request, response) => {
  Report.find({})
    .then((reports) => {
      response.render('overview', {
        userId: request.user._id,
        name: request.user.name,
        role: request.user.role,
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
    response.redirect('/reports')
  } catch (error) {
    console.log(error)
  }
})

reportRouter.get('/viewReport/:id', ensureAuthenticated, async (request, response) => {
  const { id } = request.params

  try {
    const report = await Report.findById({ _id: id })
    response.render('viewReport', {
      role: request.user.role,
      report
    })
  } catch (error) {
    console.log(error)
  }
})
// developing
reportRouter.put('/viewReport/:id', async (request, response) => {
  console.log(request.params.id)
  try {
    await Report.findOneAndUpdate({ _id: request.params.id },
      {
        $set: { status: request.body.status }
      })
    console.log('updated')
    response.redirect('/reports')
  } catch (error) {
    console.error(error)
  }
})

reportRouter.delete('/deleteReport/:id', async (request, response) => {
  console.log(request.params.id)
  try {
    // const report = Report.findById({ _id: request.params.id })
    await Report.remove({ _id: request.params.id })
    console.log('deleted')
    response.redirect('/reports')
  } catch (error) {
    response.redirect('/reports')
  }
})

module.exports = reportRouter
