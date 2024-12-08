const app = require('./app')
const config = require('./utils/config')
const { info } = require('./utils/logger')

app.listen(config.PORT, () => {
  info(`Server starting on http://localhost:${config.PORT}`)
})
