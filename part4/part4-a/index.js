import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'

dotenv.config()

const app = express()
const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

app.use(express.json())
app.use(cors())
app.disable('x-powered-by')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = mongoose.model('Blog', blogSchema)

mongoose.set('strictQuery', false)

mongoose.connect(MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch(error => console.error(error.message))

app.get('/', (request, response) => {
  response.send('<h1>Hello blogs</h1>')
})

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
    .catch(error => console.error(error.message))
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => console.error(error.message))
})

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:3001')
})
