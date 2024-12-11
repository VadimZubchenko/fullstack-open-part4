const app = require('./app') // essential Express-application
const config = require('./utils/config')
const { info } = require('./utils/logger')

// Start application server (backend)
app.listen(config.PORT, () => {
  info(`Server starting on http://localhost:${config.PORT}`)
})
