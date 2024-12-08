const express = require('express')
const app = express()
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const mongoose = require('mongoose')
const { info, error } = require('./utils/logger')

const mongoUrl = config.MONGODB_URI

// false allows queries to use fields that are not defined in the schema
mongoose.set('strictQuery', false)
info('Connecting to ', mongoUrl)

mongoose
  .connect(mongoUrl)
  .then(() => {
    info('Connected to MongoDB')
  })
  .catch((err) => {
    error('error connection to MongoDB: ', err.message)
  })

app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs', blogsRouter)

module.exports = app
