const User = require('../models/user')
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // Validate raw password length before hash
  if (!password || password.length < 3) {
    return response
      .status(400)
      .json({ error: 'Password must be at least 3 characters long' })
  }

  const saltRound = 10
  const passwordHash = await bcrypt.hash(password, saltRound)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).send(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})

  response.status(200).json(users)
})

module.exports = usersRouter
