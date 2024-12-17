const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const mongoose = require('mongoose')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const { id } = request.params
  // Check if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: 'Invalid blog ID format' })
  }

  const blog = await Blog.findById(id)

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).json({ error: 'Blog not found' })
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

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = {
    title: title,
    author: author,
    url: url,
    likes: likes,
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  })
  response.json(updatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params

  await Blog.findByIdAndDelete(id)
  response.status(204).end()
})

module.exports = blogsRouter
