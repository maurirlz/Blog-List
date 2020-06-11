const User = require('../../models/user');

const initialUsers = [
  {
    username: 'maurirlz',
    name: 'Mauricio E. Benitez',
    password: 'root',
  },
  {
    username: 'beniziorlz',
    name: 'Benizio E. Mauritez',
    password: 'toor',
  }
];

const getUsersInDatabase = async () => {
  const returnedUsers = await User.find({});

  return returnedUsers.map((returnedUser) => returnedUser.toJSON());
};

module.exports = {
  initialUsers,
  getUsersInDatabase,
};
