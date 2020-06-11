const Blog = require('../models/blog');
const userHelper = require('./usertests/user_helper');

const users = userHelper.getUsersInDatabase();

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'Benitez Mauricio',
    url: 'somesite.com',
    likes: 5,
    user: '5ee1cb9ac57df155b05f11c0',
  },
  {
    title: 'HTML is not easy',
    author: 'Benizio E. Mauritez',
    url: 'someurl.com',
    likes: 10,
    user: '5ee1cb9ac57df155b05f11c1',
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
