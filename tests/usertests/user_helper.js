const User = require('../../models/user');

const initialUsers = [
  {
    username: 'maurirlz25',
    name: 'Mauricio',
    password: 'root',
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
