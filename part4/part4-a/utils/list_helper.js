import _ from 'lodash'

export const dummy = array => {
  return 1
}

export const totalLikes = array => {
  return array.length === 0
    ? 0
    : array.reduce((acc, item) => acc + item.likes, 0)
}

export const favoriteBlog = blogs => {
  if (!Array.isArray(blogs)) throw new Error('Input must be an array of blog objects')
  if (blogs.length === 0) return 0

  let favoriteBlog = null
  let maxLikes = 0

  for (const blog of blogs) {
    const currentLikes = blog.likes ?? 0

    if (currentLikes > maxLikes) {
      favoriteBlog = blog
      maxLikes = currentLikes
    }
  }

  return favoriteBlog
}

export const mostBlogs = blogs => {
  if (!Array.isArray(blogs)) throw new Error('Input must be an array of blog objects')
  if (blogs.length === 0) return 0

  // Count blogs by author using Lodash's 'countBy' function
  const authorBlogCounts = _.countBy(blogs, 'author')

  // Convert authorBlogCounts to an array of objects
  const authorBlogData = Object.entries(authorBlogCounts).map(([author, count]) => ({
    author,
    blogs: count
  }))

  // Find the author with the most blogs using Lodash's maxBy function
  const mostProlificAuthor = _.maxBy(authorBlogData, 'blogs')

  return mostProlificAuthor
}
