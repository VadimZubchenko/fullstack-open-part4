const User = require('../models/user')
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const mongoose = require('mongoose')
const { response } = require('../app')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username || !password) {
    return response
      .status(401)
      .json({ error: 'username and password are required' })
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
