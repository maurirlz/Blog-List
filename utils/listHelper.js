const dummy = (blogs) => {

  return 1;
}

const totalLikes = (blogs) => {

  return blogs.reduce((total, blog) => total + Number(blog.likes), 0);
}

const favoriteBlog = (blogs) => {

  return blogs.reduce((mostLikedBlog, blog) => mostLikedBlog.likes >= blog.likes ? mostLikedBlog : blog);
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
