const { model, Schema } = require('mongoose')

const ReportSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  reportContent: {
    type: String,
    required: true
  },
  image: {
    type: String,
    require: true
  },
  cloudinaryId: {
    type: String,
    require: true
  },
  status: {
    type: String,
    default: 'processing'
  },
  date: {
    type: Date,
    default: new Date()
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

ReportSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Report = model('Report', ReportSchema)

module.exports = Report
