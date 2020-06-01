const listHelperTest = require('../utils/listHelper');

describe(' total likes ', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0,
    },
  ];

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelperTest.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });
});

describe(' Most Likes ', () => {
  const blogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0,
    },
    {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    },
  ];

  test('finds most liked blog in total blogs', () => {
    const result = blogs[1];
    const test = listHelperTest.favoriteBlog(blogs);

    expect(test).toEqual(result);
  });
});

describe(' Most Blogs ', () => {
  const authors = [
    {
      author: 'Robert C. Martin',
      blogs: 3,
    },
    {
      author: 'Mauricio E. Benitez',
      blogs: 5,
    },
    {
      author: 'Benizio E. Mauritez',
      blogs: 9,
    },
  ];

  test(' Finds the author with the highest blog count ', () => {
    const result = authors[2];
    const test = listHelperTest.mostBlogs(authors);

    expect(test).toEqual(result);
  });
});
