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

  test('A valid blog can be added', async () => {
    const newBlog = {
      title: 'Blog testing',
      author: 'Agustin Castro',
      url: 'www.testing.com',
      likes: 30
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)

    const blogsTitle = blogsAtEnd.map(b => b.title)
    const blogsAuthor = blogsAtEnd.map(b => b.author)
    const blogsUrl = blogsAtEnd.map(b => b.url)
    const blogsLikes = blogsAtEnd.map(b => b.likes)

    assert(blogsTitle.includes('Blog testing'))
    assert(blogsAuthor.includes('Agustin Castro'))
    assert(blogsUrl.includes('www.testing.com'))
    assert(blogsLikes.includes(30))
  })
})

after(async () => {
  await mongoose.connection.close()
})
