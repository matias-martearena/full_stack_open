import { beforeEach, describe, test, after } from 'node:test'

import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'

import { app } from '../app.js'
import { blogsInDb, initialBlogs, nonExistingId } from './test_helper.js'
import Blog from '../models/blog.js'
import User from '../models/user.js'

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
    const userAtStart = await User.find({})

    const user = userAtStart[0]

    const userInfo = {
      username: user.username,
      password: 'secret'
    }

    const response = await api
      .post('/api/login')
      .send(userInfo)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const userToken = `Bearer ${response.body.token}`

    const newBlog = {
      title: 'Blog testing',
      author: 'Agustin Castro',
      url: 'www.testing.com',
      likes: 30,
      userId: user.id
    }

    await api
      .post('/api/blogs')
      .set('Authorization', userToken)
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
    const userAtStart = await User.find({})

    const user = userAtStart[0]

    const userInfo = {
      username: user.username,
      password: 'secret'
    }

    const response = await api
      .post('/api/login')
      .send(userInfo)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const userToken = `Bearer ${response.body.token}`

    const newBlog = {
      author: 'Matias Martearena',
      likes: 10,
      userId: user.id
    }

    await api
      .post('/api/blogs')
      .set('Authorization', userToken)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })

  test('fails with status code 500 if there is no token', async () => {
    const blogsAtStart = await blogsInDb()
    const userAtStart = await User.find({})

    const user = userAtStart[0]

    const userInfo = {
      username: user.username,
      password: 'secret'
    }

    await api
      .post('/api/login')
      .send(userInfo)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const newBlog = {
      title: 'Blog testing',
      author: 'Agustin Castro',
      url: 'www.testing.com',
      likes: 30,
      userId: user.id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(500)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })

  test('fails with status code 401 if there is a incorrect token', async () => {
    const blogsAtStart = await blogsInDb()
    const userAtStart = await User.find({})

    const user = userAtStart[0]

    const userInfo = {
      username: user.username,
      password: 'secret'
    }

    await api
      .post('/api/login')
      .send(userInfo)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const newBlog = {
      title: 'Blog testing',
      author: 'Agustin Castro',
      url: 'www.testing.com',
      likes: 30,
      userId: user.id
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer :token')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    assert.strictEqual(response.body.error, 'token invalid')
  })
})

describe('Properties is or not missing from the data', () => {
  test('The likes property is not missing from the request', async () => {
    const userAtStart = await User.find({})

    const user = userAtStart[0]

    const userInfo = {
      username: user.username,
      password: 'secret'
    }

    const response = await api
      .post('/api/login')
      .send(userInfo)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const userToken = `Bearer ${response.body.token}`

    const newBlog = {
      title: 'Likes testing',
      author: 'Ignacio Martearena',
      url: 'www.testing2.com',
      userId: user.id
    }

    const newBlogWithoutLikes = newBlog.likes !== undefined
    assert.strictEqual(newBlogWithoutLikes, false)

    const response2 = await api
      .post('/api/blogs')
      .set('Authorization', userToken)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const haveLikes = response2.body.likes !== undefined

    assert.strictEqual(haveLikes, true)
    assert.strictEqual(response2.body.likes, 0)
  })

  test('Title property is missing from the request data', async () => {
    const userAtStart = await User.find({})

    const user = userAtStart[0]

    const userInfo = {
      username: user.username,
      password: 'secret'
    }

    const response = await api
      .post('/api/login')
      .send(userInfo)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const userToken = `Bearer ${response.body.token}`

    const newBlogWithoutTitle = {
      author: 'Olivia Juarez',
      url: 'www.testing3.com',
      likes: 14,
      userId: user.id
    }

    const missingTitle = newBlogWithoutTitle.title !== undefined
    assert.strictEqual(missingTitle, false)

    const response2 = await api
      .post('/api/blogs')
      .set('Authorization', userToken)
      .send(newBlogWithoutTitle)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response2.body.error, 'Title and url are required')
  })

  test('Url property is missing from the request data', async () => {
    const userAtStart = await User.find({})

    const user = userAtStart[0]

    const userInfo = {
      username: user.username,
      password: 'secret'
    }

    const response = await api
      .post('/api/login')
      .send(userInfo)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const userToken = `Bearer ${response.body.token}`

    const newBlogWithoutUrl = {
      title: 'Testing blog part3',
      author: 'Olivia Juarez',
      likes: 14,
      userId: user.id
    }

    const missingUrl = newBlogWithoutUrl.url !== undefined
    assert.strictEqual(missingUrl, false)

    const response2 = await api
      .post('/api/blogs')
      .set('Authorization', userToken)
      .send(newBlogWithoutUrl)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response2.body.error, 'Title and url are required')
  })
})

after(async () => {
  await mongoose.connection.close()
})
