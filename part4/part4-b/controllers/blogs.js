import express from 'express'
import Blog from '../models/blog.js'

export const blogsRouter = express.Router()

blogsRouter.get('/', async (request, response, next) => {
  const blogs = await Blog.find({})
  return response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const { title, author, url, likes } = request.body

  if (title === undefined || url === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes ?? 0
  })

  const savedBlog = await blog.save()
  return response.status(201).json(savedBlog)
})
