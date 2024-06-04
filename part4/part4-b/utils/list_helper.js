import _ from 'lodash'
import { info } from './logger.js'

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

  info('Favorite blog:', favoriteBlog)
  info('Max likes:', maxLikes)

  return favoriteBlog
}

export const mostBlogs = blogs => {
  if (!Array.isArray(blogs)) throw new Error('Input must be an array of blog objects')
  if (blogs.length === 0) return 0

  // Count blogs by author using Lodash's 'countBy' function
  const authorBlogCounts = _.countBy(blogs, 'author')

  info('Author blog counts:', authorBlogCounts)

  // Convert authorBlogCounts to an array of objects
  const authorBlogData = Object.entries(authorBlogCounts).map(([author, count]) => ({
    author,
    blogs: count
  }))

  info('Array with author-blogs:', authorBlogData)

  // Find the author with the most blogs using Lodash's maxBy function
  const mostProlificAuthor = _.maxBy(authorBlogData, 'blogs')

  info('The author with most blogs:', mostProlificAuthor)

  return mostProlificAuthor
}

export const mostLikes = blogs => {
  if (!Array.isArray(blogs)) throw new Error('Input must be an array of blog objects')
  if (blogs.length === 0) return 0

  // Calculate likes by author using Lodash's reduce and groupBy functions:
  // Calculate the total number of likes for each author in a list of blogs and store the results in an object
  const authorLikesData = _.chain(blogs)
    .groupBy('author')
    .reduce((acc, authorBlogs) => {
      const author = authorBlogs[0].author
      const authorLikes = _.sumBy(authorBlogs, 'likes')
      acc[author] = authorLikes
      return acc
    }, {})
    .value()

  info('List of blog to calculate how is the author with most likes:', authorLikesData)

  const authorLikesArray = Object.entries(authorLikesData).map(([author, likes]) => ({
    author,
    likes
  }))

  info('Array with author-likes blogs', authorLikesArray)

  const mostLikedAuthor = _.maxBy(authorLikesArray, 'likes')

  info('Author with most likes:', mostLikedAuthor)

  return mostLikedAuthor
}
