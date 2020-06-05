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

test('a specific blog can be viewed', async () => {
  const blogs = await helper.queryAllBlogs();

  const blogToView = blogs[0];

  const fetchedBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(fetchedBlog.body).toEqual(blogToView);
});

test('a specific note can be deleted', async () => {
  const blogs = await helper.queryAllBlogs();
  const blogToDelete = blogs[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAfterDelete = await helper.queryAllBlogs();

  expect(blogsAfterDelete).toHaveLength(helper.initialBlogs.length - 1);

  const titles = blogsAfterDelete.map((blog) => blog.title);

  expect(titles).not.toContain(blogToDelete.title);
});

afterAll(() => {
  mongoose.connection.close();
});
