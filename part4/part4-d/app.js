import express from 'express'
import mongoose from 'mongoose'
import 'express-async-errors'

import { blogsRouter } from './controllers/blogs.js'
import { usersRouter } from './controllers/users.js'
import { info, errors } from './utils/logger.js'
import { MONGODB_URI } from './utils/config.js'
import {
  corsMiddleware,
  errorHandler,
  requestLogger,
  unknownEndpoint
} from './utils/middlewares.js'

mongoose.set('strictQuery', false)
mongoose.connect(MONGODB_URI)
  .then(() => info('connected to MongoDB'))
  .catch(error => errors('Error connecting to MongoDB:', error.message))

export const app = express()

app.disable('x-powered-by')

app.use(corsMiddleware())
app.use(express.json())
app.use(requestLogger)

app.get('/', (request, response) => {
  response.send('<h1>Hello blogs</h1>')
})

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(unknownEndpoint)
app.use(errorHandler)
