const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'Benitez Mauricio',
    url: 'somesite.com',
    likes: 5,
  },
  {
    title: 'HTML is not easy',
    author: 'Benizio Mauritez',
    url: 'someurl.com',
    likes: 10,
  },
];


const nonExistingId = async () => {
  const blog = new Blog({ title: 'will remove this blog soon. ' });
  await blog.save();
  await blog.remove();

  // eslint-disable-next-line no-underscore-dangle
  return blog._id.toString();
};

const queryAllBlogs = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  queryAllBlogs,
};
