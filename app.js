// Create server as an app
const express = require('express')
const app = express()
// Create routers
const blogsRouter = require('./controllers/blogs')
// Use middleware for logging
const requestLogger = require('./utils/middleware').requestLogger
// Take parameters and mongoose for MongoDB connection
const config = require('./utils/config')
const mongoose = require('mongoose')
// Print info on consol
const { info, error } = require('./utils/logger')

// mongoDB url
const mongoUrl = config.MONGODB_URI

// false allows queries to use fields that are not defined in the schema
mongoose.set('strictQuery', false)

// Connect to mongoDB
info('Connecting to', mongoUrl)

mongoose
  .connect(mongoUrl)
  .then(() => {
    info('Connected to MongoDB')
  })
  .catch((err) => {
    error('error connection to MongoDB: ', err.message)
  })

app.use(express.json())
app.use(requestLogger)
app.use('/api/blogs', blogsRouter)

module.exports = app
