const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
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

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes, userId } = request.body

  // Validate required fields
  if (!title || !url) {
    return response.status(400).json({ error: 'Title and URL are required' })
  }
  console.log('user:', userId)
  const user = await User.findById(userId)
  console.log('user: ', user)

  // Create the blog with a default value for likes if not provided
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0, // Default to 0 if likes is not provided
    user: user._id,
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.json(savedBlog)
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
