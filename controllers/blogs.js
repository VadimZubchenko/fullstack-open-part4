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
  const { title, author, url, likes } = request.body

  // Validate required fields
  if (!title || !url) {
    return response.status(400).json({ error: 'Title and URL are required' })
  }

  // Create the blog with a default value for likes if not provided
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0, // Default to 0 if likes is not provided
  })

  blog
    .save()
    .then((savedBlog) => {
      response.status(201).json(savedBlog)
    })
    .catch((error) => {
      response.status(500).json({ error: 'Failed to save the blog' })
    })
})

module.exports = blogsRouter
