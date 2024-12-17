const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const Blog = require('../models/blog')

describe('when DB has already saved blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const allTitle = response.body.map((e) => e.title)
    // is the parameter truthy
    assert(allTitle.includes('Go To Statement Considered Harmful'))
  })

  describe('viewing a certain blog', () => {
    test('success with valide id', async () => {
      const allBlogs = await helper.blogsInDB()
      const firstBlog = allBlogs[0]

      const resultBlog = await api
        .get(`/api/blogs/${firstBlog.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultBlog.body, firstBlog)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonExistBlogId = await helper.nonExistingBlog()
      const response = await api
        .get(`/api/blogs/${validNonExistBlogId}`)
        .expect(404)
      assert.strictEqual(response.status, 404)
    })

    test('false id caused statuscode 400', async () => {
      const falseId = '5a3d5da59070081a82a3445'
      const response = await api.get(`/api/blogs/${falseId}`).expect(400)
      assert.strictEqual(response.status, 400)
    })
  })

  describe('addition of a new blog', () => {
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
      assert.strictEqual(
        updatedBlogs.body.length,
        helper.initialBlogs.length + 1
      )
      // check if the new blog is added the DB
      assert(titles.includes(newBlog.title))
    })

    test('add a blog with empty field of likes', async () => {
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

    test('add a blog with empty field of title, url or both', async () => {
      // Creating blogs with all possible missing fields cases
      const blogsWithoutRequiredFields = [
        {
          title: null, // Missing title
          author: 'Albert Oldman',
          url: 'http://example.com',
          likes: 707,
        },
        {
          title: 'A Title',
          author: 'Albert Oldman',
          url: null, // Missing url
          likes: 707,
        },
        {
          author: 'Albert Oldman', // Both title and url missing
          likes: 707,
        },
      ]
      // Map through each invalid blog, sending a POST request and expecting 400
      await Promise.all(
        blogsWithoutRequiredFields.map((invalidBlog) =>
          api.post('/api/blogs').send(invalidBlog).expect(400)
        )
      )

      // Verify the number of blogs in the database hasn't beend changed
      const result = await api.get('/api/blogs')
      assert.strictEqual(result.body.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', async () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDB()
      const blogToDelete = blogsAtStart[0]

      const response = await api.delete(`/api/blogs/${blogToDelete.id}`)

      const blogsAtEnd = await helper.blogsInDB()
      // Check status code 204
      assert.strictEqual(response.status, 204)
      // Check the blog was deleted
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
      const titles = blogsAtEnd.map((r) => r.title)
      assert(!titles.includes(blogToDelete.title))
    })
  })
  describe('update blog by id', () => {
    test('update amount of likes of certain blog', async () => {
      // get specific blog id from DB
      const blogs = await helper.blogsInDB()
      const id = blogs[0].id

      const updatedBlog = {
        likes: 122,
      }

      const response = await api
        .put(`/api/blogs/${id}`)
        .send(updatedBlog)
        .expect(200)

      assert.strictEqual(response.body.likes, updatedBlog.likes)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
