const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

// transform returned DB JSON to cleaner format by deleting '_id' and '_v' (version of doc, autom-lly added by Mongoose )
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
