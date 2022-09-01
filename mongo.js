require('dotenv').config() // as early as posible

const mongoose = require('mongoose')
const connectionString = process.env.MONGO_URI

mongoose
  .connect(connectionString,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  .then(() => {
    console.log('💻 Database Connected')
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
