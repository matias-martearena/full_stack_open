import express from 'express'
import Blog from '../models/blog.js'

export const blogsRouter = express.Router()

blogsRouter.get('/', (request, response, next) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
    .catch(error => next(error))
})

blogsRouter.post('/', (request, response, next) => {
  const { title, author, url, likes } = request.body

  if (title === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes ?? 0
  })

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => next(error))
})
