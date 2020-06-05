const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const Blog = require('../models/blog');
const logger = require('../utils/logger');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  logger.info('cleared');

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  const result = await Promise.all(promiseArray);

  logger.info('done');
});
describe(' Checks for when we are doing a GET request to get the full blogs ', () => {
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
});

describe('Searching an specific attribute for blogs', () => {
  test('a specific title is within the returned blogs', async () => {
    const response = await api.get('/api/blogs');

    const titles = response.body.map((blog) => blog.title);

    expect(titles).toContain('HTML is not easy');
  });
  test('it exist a property named id in the database.', async () => {
    const blogs = await helper.queryAllBlogs();

    expect(blogs[0].id).toBeDefined();
  });
});

describe('Adding a blog to the database', () => {
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

  test('a blog without title or author cannot be added.', async () => {
    const newBlog = {
      likes: 5,
    };

    await api.post('/api/blogs').send(newBlog).expect(400);

    const blogs = await helper.queryAllBlogs();

    expect(blogs).toHaveLength(helper.initialBlogs.length);
  });

  test('When sending a blog without the property likes defined, it defaults to 0', async () => {
    const newBlog = {
      title: 'Likes defaulting to 0',
      author: 'Benizio Mauritez',
      url: 'localhost:3003/api/blogs',
    };
    await api.post('/api/blogs').send(newBlog).expect(200);

    const blogs = await helper.queryAllBlogs();

    const foundBlog = blogs.find((blog) => blog.title === 'Likes defaulting to 0');
    expect(foundBlog.likes).toBe(0);
  });
});

describe(' Querying the database ', () => {
  test('a specific blog can be viewed', async () => {
    const blogs = await helper.queryAllBlogs();

    const blogToView = blogs[0];

    const fetchedBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(fetchedBlog.body).toEqual(blogToView);
  });

  test('a specific blog can be deleted', async () => {
    const blogs = await helper.queryAllBlogs();
    const blogToDelete = blogs[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAfterDelete = await helper.queryAllBlogs();

    expect(blogsAfterDelete).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAfterDelete.map((blog) => blog.title);

    expect(titles).not.toContain(blogToDelete.title);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
