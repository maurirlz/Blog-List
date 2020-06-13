const blogRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');

// get all blogs

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 });
  response.json(blogs.map((blog) => blog.toJSON()));
});

// get a blog by id

blogRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  });

  if (blog) {
    response.json(blog.toJSON());
  } else {
    response.status(404).end();
  }
});

// post a blog

// eslint-disable-next-line consistent-return
blogRouter.post('/', async (request, response, next) => {
  const { token, body } = request;
  const verifyToken = jwt.verify(token, process.env.SECRET);
  const foundUser = await User.findById(body.user);

  if (!token || !verifyToken) {
    response.status(403);
  }

  if (!body || !body.title || !body.author || !body.url) {
    return response.status(400).json({ error: 'Malformatted blog' });
  }

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: foundUser._id,
  });

  const savedBlog = await newBlog.save();
  foundUser.blogs = foundUser.blogs.concat(savedBlog._id);
  await foundUser.save();
  response.json(savedBlog.toJSON());
});

// delete a note

blogRouter.delete('/:id', async (request, response, next) => {
  const { token } = request;
  const blogId = request.params.id;
  const blog = await Blog.findById(blogId);

  if (!blog) {
    return response.status(204).end();
  }

  const blogUser = blog.user.toString();
  const decodedToken = jwt.decode(token, process.env.SECRET);

  if (!token || decodedToken.id.toString() !== blogUser) {
    return response.status(403).json({
      error: 'Bad credentials.',
    });
  }

  await Blog.findByIdAndRemove(blogId);
  response.status(204).end();
});

module.exports = blogRouter;
