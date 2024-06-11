import { test, after, beforeEach, describe } from 'node:test'

import bcrypt from 'bcryptjs'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'

import { app } from '../app.js'
import { userInDb } from './test_helper.js'
import User from '../models/user.js'

const api = supertest(app)

describe('USER: --- When there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('Creation succeeds with a fresh username', async () => {
    const userAtStart = await userInDb()

    const newUser = {
      username: 'TestRiz',
      name: 'Matias Martearena',
      password: 'secret-secret'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const userAtEnd = await userInDb()
    assert.strictEqual(userAtEnd.length, userAtStart.length + 1)

    const usernames = userAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('Creation fails with proper status code and message if username already taken', async () => {
    const userAtStart = await userInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'secret-secret'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const userAtEnd = await userInDb()

    assert(result.body.error.includes('The username already exists, please try with another'))
    assert.strictEqual(userAtEnd.length, userAtStart.length)
  })

  test('Creation fails with proper status code and message if username is not defined', async () => {
    const userAtStart = await userInDb()

    const newUser = {
      name: 'Superuser',
      password: 'secret-secret'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const userAtEnd = await userInDb()

    assert(result.body.error.includes('You must enter a username'))
    assert.strictEqual(userAtEnd.length, userAtStart.length)
  })

  test('Creation fails with proper status code and message if username is shorter', async () => {
    const userAtStart = await userInDb()

    const newUser = {
      username: 'db',
      name: 'Superuser',
      password: 'secret-secret'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const userAtEnd = await userInDb()

    assert(result.body.error.includes('The username must be at least 3 characters and a maximum of 100'))
    assert.strictEqual(userAtEnd.length, userAtStart.length)
  })

  test('Creation fails with proper status code and message if name is shorter', async () => {
    const userAtStart = await userInDb()

    const newUser = {
      username: 'TestRiz',
      name: 'db',
      password: 'secret-secret'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const userAtEnd = await userInDb()

    assert(result.body.error.includes('The name must be at least 5 characters and a maximum of 100'))
    assert.strictEqual(userAtEnd.length, userAtStart.length)
  })

  test('Creation fails with proper status code and message if password is not defined', async () => {
    const userAtStart = await userInDb()

    const newUser = {
      username: 'TestRiz',
      name: 'superuser'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const userAtEnd = await userInDb()

    assert(result.body.error.includes('You must enter a password'))
    assert.strictEqual(userAtEnd.length, userAtStart.length)
  })

  test('Creation fails with proper status code and message if password is shorter', async () => {
    const userAtStart = await userInDb()

    const newUser = {
      username: 'TestRiz',
      name: 'superuser',
      password: 'db'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const userAtEnd = await userInDb()

    assert(result.body.error.includes('The password must be at least 3 characters and a maximum of 255'))
    assert.strictEqual(userAtEnd.length, userAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
