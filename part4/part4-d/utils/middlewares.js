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
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === ' TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
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

export const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }

  next()
}
