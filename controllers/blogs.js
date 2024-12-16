const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', (request, response) => {
  if (request.body.likes !== null) {
    const blog = new Blog(request.body)
    blog.save().then((result) => {
      response.status(201).json(result)
    })
  } else {
    const defaultLike = {
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: 0,
    }
    const blog = new Blog(defaultLike)
    blog.save().then((result) => {
      response.status(201).json(result)
    })
  }
})

module.exports = blogsRouter
