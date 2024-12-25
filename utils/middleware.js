const { info, err } = require('./logger')
const jwt = require('jsonwebtoken')

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

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('Authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }
  next()
}

const userExtractor = (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: 'invalid token' })
  }
  //check out user from token
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  request.user = decodedToken

  next()
}

module.exports = { requestLogger, errorHandler, tokenExtractor, userExtractor }
