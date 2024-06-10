import Blog from '../models/blog.js'

export const initialBlogs = [
  {
    title: 'Testing is funny',
    author: 'FullStackOpen',
    url: 'www.testing.com',
    likes: 4
  },
  {
    title: 'Do you try testing?',
    author: 'Free code',
    url: 'http://localhost:3001',
    likes: 18
  }
]

export const nonExistingId = async () => {
  const blog = new Blog({ title: 'will remove this soon', url: 'www.example-for-testing.com' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

export const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}
