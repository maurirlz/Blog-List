const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + Number(blog.likes), 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce((mostLikedBlog, blog) =>
    mostLikedBlog.likes >= blog.likes ? mostLikedBlog : blog
  );
};

const mostBlogs = (authors) => {
  return _.maxBy([...authors], (author) => author.blogs);
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
