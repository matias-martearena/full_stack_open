import { beforeEach, describe, test, after } from 'node:test'

import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'

import { app } from '../app.js'
import { blogsInDb, initialBlogs, nonExistingId } from './test_helper.js'
import Blog from '../models/blog.js'

const api = supertest(app)

describe('When there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
  })

  test('The blogs are returned in JSON format', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('The number of blogs are nice', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('A specific blog is within the returned blog', async () => {
    const response = await api.get('/api/blogs')

    const content = response.body.map(b => b.title)
    assert(content.includes('Testing is funny'))
  })
})

describe('Viewing a specific blog', () => {
  test('succeed with a valid id', async () => {
    const blogsAtStart = await blogsInDb()

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultBlog.body, blogToView)
  })

  test('fails with status code 404 if blog does not exist', async () => {
    const validNonexistingId = await nonExistingId()

    console.log(validNonexistingId)

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})

describe('Properties of blogs', () => {
  test('The blogs have id property', async () => {
    const blogs = await blogsInDb()
    const allHaveId = blogs.every(blog => blog.id !== undefined)

    assert.strictEqual(allHaveId, true)
  })

  test('The blogs have title property', async () => {
    const blogs = await blogsInDb()
    const allHaveTitle = blogs.every(blog => blog.title !== undefined)

    assert.strictEqual(allHaveTitle, true)
  })

  test('The blogs have author property', async () => {
    const blogs = await blogsInDb()
    const allHaveAuthor = blogs.every(blog => blog.author !== undefined)

    assert.strictEqual(allHaveAuthor, true)
  })

  test('The blogs have url property', async () => {
    const blogs = await blogsInDb()
    const allHaveUrl = blogs.every(blog => blog.url !== undefined)

    assert.strictEqual(allHaveUrl, true)
  })

  test('The blogs have like property', async () => {
    const blogs = await blogsInDb()
    const allHaveLikes = blogs.every(blog => blog.likes !== undefined)

    assert.strictEqual(allHaveLikes, true)
  })
})

describe('Addition of a new blog', () => {
  test('A valid blog can be added', async () => {
    const blogsAtStart = await blogsInDb()
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
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

    const blogsTitle = blogsAtEnd.map(b => b.title)
    const blogsAuthor = blogsAtEnd.map(b => b.author)
    const blogsUrl = blogsAtEnd.map(b => b.url)
    const blogsLikes = blogsAtEnd.map(b => b.likes)

    assert(blogsTitle.includes('Blog testing'))
    assert(blogsAuthor.includes('Agustin Castro'))
    assert(blogsUrl.includes('www.testing.com'))
    assert(blogsLikes.includes(30))
  })

  test('fails with status code 400 if data is invalid', async () => {
    const blogsAtStart = await blogsInDb()
    const newBlog = {
      author: 'Matias Martearena',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })
})

describe('Properties is or not missing from the data', () => {
  test('The likes property is not missing from the request', async () => {
    const newBlog = {
      title: 'Blog testing 2',
      author: 'Ignacio Martearena',
      url: 'www.testing2.com'
    }

    const newBlogWithoutLikes = newBlog.likes !== undefined
    assert.strictEqual(newBlogWithoutLikes, false)

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const haveLikes = response.body.likes !== undefined

    assert.strictEqual(haveLikes, true)
    assert.strictEqual(response.body.likes, 0)
  })

  test('Title property is missing from the request data', async () => {
    const newBlogWithoutTitle = {
      author: 'Olivia Juarez',
      url: 'www.testing3.com',
      likes: 14
    }

    const missingTitle = newBlogWithoutTitle.title !== undefined
    assert.strictEqual(missingTitle, false)

    await api
      .post('/api/blogs')
      .send(newBlogWithoutTitle)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('Url property is missing from the request data', async () => {
    const newBlogWithoutUrl = {
      title: 'Testing blog part3',
      author: 'Olivia Juarez',
      likes: 14
    }

    const missingUrl = newBlogWithoutUrl.url !== undefined
    assert.strictEqual(missingUrl, false)

    await api
      .post('/api/blogs')
      .send(newBlogWithoutUrl)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

describe('Deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    const content = blogsAtEnd.map(b => b.title)
    assert(!content.includes(blogToDelete.title))
  })
})

after(async () => {
  await mongoose.connection.close()
})
