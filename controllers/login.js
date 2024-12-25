const jwt = require('jsonwebtoken')
const User = require('../models/user')
const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  // Find user from DB
  const user = await User.findOne({ username })

  // Check password
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  // If some of request are not correct
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }
  // Make user object for creating a token
  const userForToken = {
    user: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response.status(200).json({ token, username: user.username, name: user.name })
})
module.exports = loginRouter
