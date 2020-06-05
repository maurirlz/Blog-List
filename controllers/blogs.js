const blogRouter = require('express').Router();
const Blog = require('../models/blog');

// get all blogs

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs.map((blog) => blog.toJSON()));
});

// get a blog by id

blogRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id);

  if (blog) {
    response.json(blog.toJSON());
  } else {
    response.status(404).end();
  }
});

// post a blog

// eslint-disable-next-line consistent-return
blogRouter.post('/', async (request, response, next) => {
  const { body } = request;

  if (!body || !body.title || !body.author || !body.url) {
    return response.status(400).json({ error: 'Malformatted blog' });
  }

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  });

  const savedBlog = await newBlog.save();
  response.json(savedBlog.toJSON());
});

// delete a note

blogRouter.delete('/:id', async (request, response, next) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

module.exports = blogRouter;
