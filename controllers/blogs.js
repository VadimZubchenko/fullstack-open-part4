const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const User = require('../models/user')
const userExtractor = require('../utils/middleware').userExtractor

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

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body

  // get user from request object
  const user = request.user

  // If token not valid
  if (!user) {
    return response.status(401).json({ error: 'token not valid' })
  }

  // find user from DB with list of blogs
  const userDB = await User.findById(user.id)

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
    user: userDB._id,
  })
  const savedBlog = await blog.save()
  userDB.blogs = userDB.blogs.concat(savedBlog.id)
  await userDB.save()
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

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const { id } = request.params
  // Find the blog by ID
  const blog = await Blog.findById(id)

  // If the blog is not found
  if (!blog) {
    return response.status(404).json({ error: `Blog with id: ${id} not found` })
  }

  // get user from request object
  const user = request.user
  // If token not valid
  if (!user) {
    return response.status(401).json({ error: 'token not valid' })
  }

  // Check if the user is the author of the blog
  if (user.id !== blog.user.toString()) {
    response
      .status(403)
      .json({ error: 'You don not have permission to delete this blog' })
  }

  // Delete blog
  await blog.deleteOne()
  response.status(204).end()
})

module.exports = blogsRouter
