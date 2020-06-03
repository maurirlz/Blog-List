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

const mostLikes = (blogs) => {
  // before = blogs
  const formattedBlogs = blogs.map(({ title, url, __v, _id, ...blog }) => blog);

  const groupedByAuthor = _.groupBy(formattedBlogs, 'author');

  const totalData = _.mapValues(groupedByAuthor, (o) => o.map((o1) => o1.likes));

  const results = Object.keys(totalData).map((key) => {
    return { author: key, likes: totalData[key].reduce((a, b) => a + b, 0) };
  });

  return results.reduce((prev, curr) => {
    return prev.likes > curr.likes ? prev : curr;
  });
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
