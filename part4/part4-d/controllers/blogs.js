import express from 'express'
import jwt from 'jsonwebtoken'

import Blog from '../models/blog.js'
import User from '../models/user.js'

export const blogsRouter = express.Router()

blogsRouter.get('/', async (request, response, next) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  return response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
  const { id } = request.params

  const blog = await Blog
    .findById(id)
    .populate('user', { username: 1, name: 1 })

  return blog
    ? response.json(blog)
    : response.status(404).json({ error: 'Blog not found' })
})

blogsRouter.post('/', async (request, response, next) => {
  const { title, author, url, likes, userId } = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response
      .status(401)
      .json({ error: 'token invalid' })
  }

  if (decodedToken.id !== userId) {
    return response
      .status(401)
      .json({ error: 'User ID and token user ID do not match' })
  }

  const user = await User.findById(decodedToken.id)

  if ((title || url) === undefined) {
    return response
      .status(400)
      .json({ error: 'Title and url are required' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes ?? 0,
    user: user.id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  return response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response
      .status(401)
      .json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const deletedBlog = await Blog.findById(id)

  if (user._id.toString() !== deletedBlog.user.toString()) {
    return response
      .status(401)
      .json({ error: 'The user is not enabled to do this operation' })
  }

  if (!deletedBlog) {
    return response.status(404).json({ error: 'Blog not exist' })
  }

  await Blog.deleteOne({ _id: deletedBlog._id })

  return response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes } = request.body
  const { id } = request.params

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' }
  )

  if (!updatedBlog) {
    return response.status(404).json({ error: 'Blog not found' })
  }

  return response.json(updatedBlog)
})
