const blogsRouter = require('express').Router()

let blogs = []

blogsRouter.get('/', (request, response) => {
  /* Blog.find({}).then((blogs) => {
    response.json(blogs)
  }) */
  response.json(blogs)
})

blogsRouter.post('/', (request, response) => {
  const blog = request.body
  response.json({ message: 'Data has been added.', data: blogs.push(blog) })
})

module.exports = blogsRouter
