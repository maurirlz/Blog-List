const User = require('../../models/user');

const initialUsers = [
  {
    username: 'fabrirlz',
    name: 'Fabricio',
    password: 'root',
  },
  {
    username: 'maurirlz',
    name: 'Mauricio',
    password: 'toor',
  },
];

const getUsersInDatabase = async () => {
  const returnedUsers = await User.find({});

  return returnedUsers.map((returnedUser) => returnedUser.toJSON());
};

module.exports = {
  initialUsers,
  getUsersInDatabase,
};
