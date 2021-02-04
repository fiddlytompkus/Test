const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: String,
  dateadded: String,
  isEdited: {
    type: Boolean,
    default: false,
  },
  authorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  authorUsername: String,
  likes: [String],
});

module.exports = mongoose.model('Comment', commentSchema);
