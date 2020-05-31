const blogRouter = require('express').Router();
const Blog = require('../models/blog');

// get all blogs

blogRouter.get('/', (request, response) => {

  debugger
  Blog
    .find({ })
    .then((blogs) => {
      response.json(blogs);
    });
});

// post a blog

blogRouter.post('/', (request, response, next) => {
  const { body } = request;

  if (!body) {
    return response.status(400).json({ error: 'Malformatted blog' });
  }

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  newBlog
    .save()
    .then((returnedBlog) => response.json(returnedBlog.toJSON()))
    .catch((error) => next(error));
});

module.exports = blogRouter;

