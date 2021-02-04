const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  caption: String,
  postContent: String,
  createdDate: {
    type: Date,
    default: Date.now(),
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  authorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  authorUsername: String,
  comments: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Comment',
    },
  ],
  likes: [String],
});

module.exports = mongoose.model('Post', postSchema);
