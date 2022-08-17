
const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  passwordHash: {
    type: String
  },
  reports: [{
    type: Schema.Types.ObjectId,
    ref: 'Report'
  }]
})

UserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v

    delete returnedObject.password
  }
})

const User = model('User', UserSchema)

module.exports = User
