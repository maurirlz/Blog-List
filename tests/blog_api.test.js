const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();

  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('a specific title is within the returned blogs', async () => {
  const response = await api.get('/api/blogs');

  const titles = response.body.map((blog) => blog.title);

  expect(titles).toContain('HTML is not easy');
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls.',
    author: 'Benitez Mauricio',
    url: 'benjamin.com',
    likes: '50',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const response = await helper.queryAllBlogs();
  expect(response).toHaveLength(helper.initialBlogs.length + 1);

  const blogTitles = response.map((blog) => blog.title);
  expect(blogTitles).toContain('async/await simplifies making async calls.');
});

test('blog without title or author is not added.', async () => {
  const newBlog = {
    likes: 5,
  };

  await api.post('/api/blogs').send(newBlog).expect(400);

  const blogs = await helper.queryAllBlogs();

  expect(blogs).toHaveLength(helper.initialBlogs.length);
});

afterAll(() => {
  mongoose.connection.close();
});
