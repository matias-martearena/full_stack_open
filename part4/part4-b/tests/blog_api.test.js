import { beforeEach, describe, test, after } from 'node:test'

import assert from 'node:assert'
import supertest from 'supertest'
import mongoose from 'mongoose'

import Blog from '../models/blog.js'
import { app } from '../app.js'
import { blogsInDb, initialBlogs } from './test_helper.js'

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  for (const blog of initialBlogs) {
    const blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('Blog api test', () => {
  test('Blogs are in JSON format', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Correct number of blogs', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('The blogs have id property', async () => {
    const blogs = await blogsInDb()
    const allHaveId = blogs.every(obj => obj.id !== undefined)

    assert.strictEqual(allHaveId, true)
  })
})

after(async () => {
  await mongoose.connection.close()
})
