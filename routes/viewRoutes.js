const express = require('express');
// const postController = require('./../Controller/postController');
const Post = require('./../models/postModel');

const router = express.Router();

router.route('/login').get((req, res, next) => {
  res.render('login.ejs');
});
router.route('/register').get((req, res, next) => {
  res.render('register.ejs');
});
router.route('/forgotPassword').get((req, res, next) => {
  res.render('forgotPassword.ejs');
});
router.route('/newsFeed').get(async (req, res, next) => {
  const post = await Post.find();
  // console.log(post);
  res.render('newsFeed.ejs', {
    data: post,
  });
});
module.exports = router;
