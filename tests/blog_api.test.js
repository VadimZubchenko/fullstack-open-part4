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

test('the certain blog with id', async () => {
  const allBlogs = await helper.blogsInDB()
  const firstBlog = allBlogs[0]

  const resultBlog = await api
    .get(`/api/blogs/${firstBlog.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultBlog.body, firstBlog)
})

test('add the new blog and check it', async () => {
  const newBlog = {
    title: 'How to create DB on Mongo Atlas',
    author: 'Johny Cash',
    url: 'https://johny.cash.com/mongoAtlas',
    likes: 101,
  }

  await api
    .post('/api/blogs/')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const updatedBlogs = await api.get('/api/blogs')

  const titles = updatedBlogs.body.map((e) => e.title)
  // check if DB length get the new block
  assert.strictEqual(updatedBlogs.body.length, helper.initialBlogs.length + 1)
  // check if the new blog is added the DB
  assert(titles.includes(newBlog.title))
})

test.only('add a blog without liking', async () => {
  const blogWithoutLikes = {
    title: 'The most populared JavaScript framework',
    author: 'Albert Oldman',
    url: 'http://www.javascripttutorial.com/albert.oldman/framework',
    likes: null,
  }
  // add a blog with likes: null
  await api.post('/api/blogs').send(blogWithoutLikes).expect(201)
  // get the blog
  const result = await api.get('/api/blogs')
  // destrict likes of all blogs
  const likes = result.body.map((e) => e.likes)

  // check if added blog has likes: 0
  assert.strictEqual(likes[likes.length - 1], 0)
})

after(async () => {
  await mongoose.connection.close()
})
