const { test, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are three blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('the first blog is about HTTP methods', async () => {
  const response = await api.get('/api/blogs')

  const title = response.body.map((e) => e.title)
  // is the parameter truthy
  assert(title.includes('React patterns'))
})

test.only('the certain blog with id', async () => {
  const allBlogs = await helper.blogsInDB()
  const firstBlog = allBlogs[0]

  const resultBlog = await api
    .get(`/api/blogs/${firstBlog.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultBlog.body, firstBlog)
})

after(async () => {
  await mongoose.connection.close()
})
