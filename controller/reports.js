require('dotenv').config() // as early as posible
const reportRouter = require('express').Router()
// const ObjectId = require('mongodb').ObjectID
const Report = require('../models/Report')
// const ROLE = require('../config/roles')
const upload = require('../middleware/multer')
const User = require('../models/User')
const cloudinary = require('../middleware/cloudinary')

const { ensureAuth } = require('../middleware/auth')

// render on overview ejs
reportRouter.get('/', ensureAuth, (request, response) => {
  // console.log(`here ${request.session.id}`)
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

reportRouter.post('/overview', upload.single('file'), async (request, response) => {
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

  // Upload image to cloudinary

  const newReport = new Report({
    title,
    reportContent,
    date,
    user: user._id
  })

  if (request.file) {
    const result = await cloudinary.uploader.upload(request.file.path)

    newReport.cloudinaryId = result.public_id
    newReport.image = result.secure_url
  }

  try {
    const savedReport = await newReport.save()

    user.reports = user.reports.concat(savedReport._id)
    await user.save()
    response.redirect('/reports')
  } catch (error) {
    console.log(error)
  }
})

reportRouter.get('/viewReport/:id', async (request, response) => {
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
  try {
    const report = await Report.findById({ _id: request.params.id })
    console.log('rprt ' + report)
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(report.cloudinaryId)
    await Report.deleteOne({ _id: request.params.id })
    console.log('deleted')
    response.redirect('/reports')
  } catch (error) {
    response.redirect('/reports')
  }
})

module.exports = reportRouter
