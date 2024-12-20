const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
]

const nonExistingBlog = async () => {
  const newBlog = new Blog({
    title: 'false Blog to be remove',
  })
  await newBlog.save()
  await newBlog.deleteOne()

  return newBlog._id.toString()
}

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  // here toJSON() uses an overrided vesion in models/blog.js
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

module.exports = { initialBlogs, blogsInDB, nonExistingBlog, usersInDb }
