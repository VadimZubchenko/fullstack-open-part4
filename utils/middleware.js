const { info, err } = require('./logger')

const requestLogger = (request, response, next) => {
  info('Method:', request.method)
  info('Path:', request.path)
  info('Body:', request.body)
  info('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  err(error.message)
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return response
      .status(400)
      .json({ error: 'expected `username` to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: 'token missing or invalid' })
  }
}

module.exports = { requestLogger, errorHandler }
