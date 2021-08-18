const mongoose = require('mongoose')
const options = {
  autoIndex: false,
  poolSize: 10,
  bufferMaxEntries: 0,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}

const connectWithRetry = () => {
  console.log('MongoDB connection with retry')
  mongoose
    .connect(process.env.MONGODB_URL, options)
    .then(() => {
      console.log('MongoDB is connected')
    })
    .catch((e) => {
      console.log('MongoDB connection unsuccessful, retry after 5 seconds.')
      setTimeout(connectWithRetry, 5000)
    })
}
const database = {
  connect: connectWithRetry
}
module.exports = database
