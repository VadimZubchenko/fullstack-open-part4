const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')

describe('DB includes already saved user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('test_test!', 10)

    const user = new User({
      username: 'usrtest',
      name: 'User Test',
      passwordHash,
    })

    await user.save()
  })
  describe('user creating', () => {
    test('creating succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
      const usernames = usersAtEnd.map((user) => user.username)
      assert(usernames.includes(newUser.username))
    })
  })
  test('creation fails with proper status code and msg if username already exist ', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'usrtest',
      name: 'Same User',
      password: 'somecore',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))
    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })
  test('failed when username or password is empty or less than 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb()

    const usersWithoutRequiredFields = [
      {
        username: null,
        name: 'Same User',
        password: 'somecore',
      },
      {
        username: 'usrtest',
        name: 'Same User',
        password: null,
      },
      {
        username: 'us',
        name: 'Same User',
        password: 'somecore',
      },
      {
        username: 'usrtestII',
        name: 'Same User',
        password: 'so',
      },
    ]

    await Promise.all(
      usersWithoutRequiredFields.map((invalidUser) =>
        api
          .post('/api/users')
          .send(invalidUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
      )
    )
    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
