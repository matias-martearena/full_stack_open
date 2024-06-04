import cors from 'cors'
import { info } from './logger.js'

const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:3001',
  'http://localhost:1234',
  'http://localhost:5173'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    if (acceptedOrigins.includes(origin)) return callback(null, true)
    if (!origin) return callback(null, true)
    return callback(new Error('Not allowed by CORS'))
  }
})

export const errorHandler = (error, request, response, next) => {
  info(`Error:
  -----
  ${error.message}
  -----`)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Bad formatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

export const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

export const requestLogger = (request, response, next) => {
  info('Method:', request.method)
  info('Path:', request.path)
  info('Body:', request.body)
  info('-------------------')

  next()
}
