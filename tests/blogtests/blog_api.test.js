const mongoose = require('mongoose');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const helper = require('../test_helper');
const userHelper = require('../usertests/user_helper');
const app = require('../../app');
const Blog = require('../../models/blog');
const User = require('../../models/user');
const logger = require('../../utils/logger');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  logger.info('cleared');

  await userHelper.initialUsers.map(async (user) => {
    await api.post('/api/users').send(user);
  });

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);

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
    const postUser = await api.post('/api/login').send({
      username: 'fabrirlz',
      password: 'root',
    });

    const { token } = postUser.body;
    const user = jwt.verify(token, process.env.SECRET);

    const newBlog = {
      title: 'async/await simplifies making async calls.',
      author: 'Benitez Mauricio',
      url: 'benjamin.com',
      likes: '50',
      user: `${user.id}`,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const response = await helper.queryAllBlogs();
    expect(response).toHaveLength(helper.initialBlogs.length + 1);

    const blogTitles = response.map((blog) => blog.title);
    expect(blogTitles).toContain('async/await simplifies making async calls.');
  });

  test('a blog without title or author cannot be added.', async () => {
    const postUser = await api.post('/api/login').send({
      username: 'fabrirlz',
      password: 'root',
    });

    const { token } = postUser.body;
    const user = jwt.verify(token, process.env.SECRET);

    const newBlog = {
      likes: 5,
      user: `${user.id}`,
    };

    await api.post('/api/blogs').set('Authorization', `bearer ${token}`).send(newBlog).expect(400);

    const blogs = await helper.queryAllBlogs();

    expect(blogs).toHaveLength(helper.initialBlogs.length);
  });

  test('When sending a blog without the property likes defined, it defaults to 0', async () => {
    const postUser = await api.post('/api/login').send({
      username: 'fabrirlz',
      password: 'root',
    });

    const { token } = postUser.body;
    const user = jwt.verify(token, process.env.SECRET);
    const newBlog = {
      title: 'Likes defaulting to 0',
      author: 'Benizio Mauritez',
      url: 'localhost:3003/api/blogs',
      user: `${user.id}`,
    };

    await api.post('/api/blogs').set('Authorization', `bearer ${token}`).send(newBlog).expect(200);

    const blogs = await helper.queryAllBlogs();

    const foundBlog = blogs.find((blog) => blog.title === 'Likes defaulting to 0');
    expect(foundBlog.likes).toBe(0);
  });
});

describe(' Querying the database ', () => {
  test('a specific blog can be viewed', async () => {
    const blogs = await helper.queryAllBlogs();

    const blogToView = {
      ...blogs[0],
      user: null,
    };

    const fetchedBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(fetchedBlog.body).toEqual(blogToView);
  });

  test('a specific blog can be deleted by its creator', async () => {
    const response = await api.post('/api/login').send({
      username: 'fabrirlz',
      password: 'root',
    });

    const { token } = response.body;
    const user = jwt.verify(token, process.env.SECRET);

    const newBlog = {
      title: 'Test blog',
      author: 'Mauricio E. Benitez',
      url: 'someurl.com',
      user: `${user.id}`,
    };

    await api.post('/api/blogs').set('Authorization', `bearer ${token}`).send(newBlog).expect(200);

    const initialBlogs = await helper.queryAllBlogs();

    const blogToDelete = await Blog.findOne({ title: 'Test blog', user: `${user.id}` });

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204);

    const blogsAfterDelete = await helper.queryAllBlogs();
    expect(blogsAfterDelete).toHaveLength(initialBlogs.length - 1);

    const titles = blogsAfterDelete.map((blog) => blog.title);
    expect(titles).not.toContain(blogToDelete.title);
  });
});

describe('User Integration with blogs', () => {
  test("After adding a new blog, querying a user's blog count reflex the added blog in it's ids.", async () => {
    const response = await api.post('/api/login').send({
      username: 'fabrirlz',
      password: 'root',
    });

    const { token } = response.body;
    const user = jwt.verify(token, process.env.SECRET);

    const newBlog = {
      title: 'Test blog',
      author: 'Mauricio E. Benitez',
      url: 'someurl.com',
      user: `${user.id}`,
    };

    await api.post('/api/blogs').set('Authorization', `bearer ${token}`).send(newBlog).expect(200);

    const blogs = await helper.queryAllBlogs();
    const addedBlogId = blogs.find((blog) => blog.title === 'Test blog').id;
    const testUser = await User.findById(`${user.id}`);
    const testUserBlogs = testUser.blogs;
    const foundBlog = testUserBlogs.find((blog) => blog.toString() === addedBlogId.toString());

    expect(foundBlog).toBeDefined();
  });

  test('Before not logging in, it is only possible to post a blog if user is logged in (Identified by a token.)', async () => {
    const initialBlogs = await helper.queryAllBlogs();

    const newBlog = {
      title: 'Test blog',
      author: 'Mauricio E. Benitez',
      url: 'someurl.com',
      user: '5ee1db3d0b64eb67a024fbff',
    };

    await api.post('/api/blogs').send(newBlog).expect(403);

    expect(initialBlogs).toHaveLength(initialBlogs.length);
  });

  test("With invalid user logged in, it is not possible to delete a post that it wasn't created by said user", async () => {
    const blogs = await helper.queryAllBlogs();
    const blogToDelete = blogs[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(403);

    expect(blogs).toHaveLength(blogs.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
