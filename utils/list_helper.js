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

module.exports = {
  dummy,
  totalLikes,
  maxLikes,
}
