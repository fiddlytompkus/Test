const Post = require('./../models/postModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const {
  findByIdAndUpdate,
  findByIdAndDelete,
} = require('./../models/postModel');
const { isValidObjectId } = require('mongoose');

exports.CreatePost = catchAsync(async (req, res, next) => {
  const newPost = await Post.create({
    caption: req.body.caption,
    postContent: req.body.postContent,
    authorId: req.user.id,
    authorUsername: req.user.username,
  });
  res.status(200).json({
    status: 'OK',
    data: {
      newPost,
    },
  });
});
exports.getAllPost = catchAsync(async (req, res, next) => {
  const allPost = await Post.find();
  // JSON.stringify(allPost)
  res.status(200).json({
    status: 'Ok',
    data: {
      allPost,
    },
  });
});

exports.UpdatePost = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const updatedPost = await Post.findByIdAndUpdate(
    id,
    {
      caption: req.body.caption,
      postContent: req.body.postContent,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedPost) {
    return next(new AppError('No document found with that ID', 404));
  }
  res.status(200).json({
    status: 'OK',
    data: {
      updatedPost,
    },
  });
});

exports.DeleteOne = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const deletedOne = await Post.findByIdAndDelete(id);
  if (!deletedOne) {
    return next(new AppError('No document found with that ID', 404));
  }
  res.status(200).json({
    status: 'OK',
    data: null,
  });
});

exports.getPostById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const GetAllById = await Post.find({ authorId: id });
  res.status(200).json({
    status: 'OK',
    data: {
      GetAllById,
    },
  });
});

exports.Like = catchAsync(async (req, res, next) => {
  const username = req.user.username;
  // console.log(username);
  const post_id = req.params.postId;
  const post = await Post.findById(post_id);
  if (!post) {
    return next(new AppError('No Post Found', 404));
  } else {
    if (post.likes.find((el) => username)) {
      const index = post.likes.indexOf(username);
      post.likes.splice(index, 1);
    } else {
      post.likes.push(username);
    }
  }
  post.save();
  // console.log(post.likes.length);
  res.status(200).json({
    status: 'OK',
    data: {
      length: post.likes.length,
    },
  });
});
