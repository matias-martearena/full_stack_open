export const dummy = array => {
  return 1
}

export const totalLikes = array => {
  return array.length === 0
    ? 0
    : array.reduce((acc, item) => acc + item.likes, 0)
}
