const mongoose = require('mongoose');
const fs = require('fs');

const storySchema = new mongoose.Schema({
  storyPhoto: String,
  content: String,
  createdAt: {
    type: Number,
    default: Date.now(),
  },
  authorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Story', storySchema);
