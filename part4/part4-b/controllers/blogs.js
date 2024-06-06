import express from 'express'
import Blog from '../models/blog.js'

export const blogsRouter = express.Router()

blogsRouter.get('/', async (request, response, next) => {
  const blogs = await Blog.find({})
  return response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
  const { id } = request.params

  const blog = await Blog.findById(id)
  return blog ? response.json(blog) : response.status(404).json({ error: 'Blog not found' })
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

blogsRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params

  const deletedBlog = await Blog.findByIdAndDelete(id)
  if (!deletedBlog) {
    return response.status(404).json({ error: 'Blog not exist' })
  }

  return response.status(204).end()
})
