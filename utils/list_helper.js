var _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  // need that each element of array passes through function.
  var initialValue = 0
  const reducer = (previousBlog, currentBlog) => {
    return previousBlog + currentBlog.likes
  }
  return blogs.length === 0 ? 0 : blogs.reduce(reducer, initialValue)
}
const maxLikes = (blogs) => {
  const likes = blogs.map((blog) => blog.likes)
  const max = Math.max(...likes)

  return blogs.find((blog) => blog.likes === max)
}
const maxBlogsAuthor = (blogs) => {
  // Group blogs by author's name
  const groupedBlogs = _.groupBy(blogs, 'author')
  // Count blogs for each author
  const authorBlogCounts = _.map(groupedBlogs, (blogs, author) => ({
    author,
    blogs: blogs.length,
  }))
  // Find author with max blogs
  const mostBlogAuthor = _.maxBy(authorBlogCounts, 'blogs')

  return mostBlogAuthor
}
const maxLikesAuthor = (blogs) => {
  // Group blogs by author's name
  const groupedBlogs = _.groupBy(blogs, 'author')

  // Calculate total likes for each author
  const authorLikesCounts = _.map(groupedBlogs, (blogs, author) => ({
    author,
    likes: _.sumBy(blogs, 'likes'),
  }))

  // Find the author with the most likes
  const mostLikeAuthor = _.maxBy(authorLikesCounts, (blog) => blog.likes)

  return mostLikeAuthor
}

module.exports = {
  dummy,
  totalLikes,
  maxLikes,
  maxBlogsAuthor,
  maxLikesAuthor,
}
