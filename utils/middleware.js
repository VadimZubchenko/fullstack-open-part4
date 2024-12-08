const { info, error } = require('./logger')

const requestLogger = (request, response, next) => {
  info('Method:', request.method)
  info('Path:', request.path)
  info('Body:', request.body)
  info('---')
  next()
}

module.exports = { requestLogger }
