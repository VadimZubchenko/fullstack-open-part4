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

module.exports = {
  dummy,
  totalLikes,
}
