import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: 3,
    maxLength: 50,
    required: true
  },
  author: {
    type: String,
    minLength: 3,
    maxLength: 100
  },
  url: {
    type: String,
    minLength: 15,
    maxLength: 255
  },
  likes: {
    type: Number
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export default mongoose.model('Blog', blogSchema)
