const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const User = require('./user');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 90,
  },
  author: {
    type: String,
    minlength: 4,
    maxlength: 25,
  },
  url: String,
  likes: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

blogSchema.plugin(uniqueValidator);

blogSchema.set('toJSON', {
  transform: (document, returnedBlog) => {
    // eslint-disable-next-line no-param-reassign,no-underscore-dangle
    returnedBlog.id = returnedBlog._id.toString();

    // eslint-disable-next-line no-param-reassign,no-underscore-dangle
    delete returnedBlog._id;
    // eslint-disable-next-line no-param-reassign,no-underscore-dangle
    delete returnedBlog.__v;
  },
});

module.exports = mongoose.model('Blog', blogSchema);
