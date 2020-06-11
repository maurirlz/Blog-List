// eslint-disable-next-line new-cap,no-new-require
const mongoose = require('mongoose');
// eslint-disable-next-line new-cap,no-new-require
const uniqueValidator = require('mongoose-unique-validator');

mongoose.set('useCreateIndex', true);

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 8,
    maxlength: 15,
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  passwordHash: {
    type: String,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
});

mongoose.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (document, returnedUser) => {
    // eslint-disable-next-line no-underscore-dangle,no-param-reassign
    returnedUser.id = returnedUser._id.toString();

    // eslint-disable-next-line no-param-reassign
    delete returnedUser.passwordHash;
    // eslint-disable-next-line no-param-reassign,no-underscore-dangle
    delete returnedUser._id;
    // eslint-disable-next-line no-param-reassign,no-underscore-dangle
    delete returnedUser.__v;
  },
});

module.exports = mongoose.model('User', userSchema);
