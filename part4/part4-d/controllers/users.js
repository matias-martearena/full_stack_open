import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/user.js'

export const usersRouter = express.Router()

usersRouter.get('/', async (request, response, next) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })

  return response.json(users)
})

usersRouter.get('/:id', async (request, response, next) => {
  const { id } = request.params

  const user = await User.findById(id)

  return user
    ? response.json(user)
    : response.status(404).json({ error: 'User not found' })
})

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  const userExists = await User.findOne({ username })

  if (userExists) {
    return response.status(400).json({ error: 'The username already exists, please try with another' })
  }

  if (username === undefined) {
    return response.status(400).json({ error: 'You must enter a username' })
  }

  if (username.length < 3 || username.length > 100) {
    return response.status(400).json({ error: 'The username must be at least 3 characters and a maximum of 100' })
  }

  if (name.length < 5 || name.length > 100) {
    return response.status(400).json({ error: 'The name must be at least 5 characters and a maximum of 100' })
  }

  if (password === undefined) {
    return response.status(400).json({ error: 'You must enter a password' })
  } else if (password.length < 3) {
    return response.status(400).json({ error: 'The password must be at least 3 characters and a maximum of 255' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  return response.status(201).json(savedUser)
})

usersRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params

  const deletedUser = await User.findByIdAndDelete(id)

  if (!deletedUser) {
    return response.status(404).json({ error: 'User not found' })
  }

  return response.status(204).end()
})
