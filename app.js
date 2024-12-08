const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')

app.use(express.json())
app.use(cors())
app.use(middleware.requestLogger)
app.use('/api/blogs', blogsRouter)

module.exports = app
