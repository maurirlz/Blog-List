const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

blogSchema.plugin(uniqueValidator, { type: 'mongoose-unique-validator' });

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
