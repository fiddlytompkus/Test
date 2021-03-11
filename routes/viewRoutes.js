const { response } = require('express');
const express = require('express');
// const postController = require('./../Controller/postController');
const authController = require('./../Controller/authController');
const Post = require('./../models/postModel');

const router = express.Router();

router.route('/login').get((req, res, next) => {
  let token;
  if (req.cookies.jwt) token = req.cookies.jwt;
  if (!token) res.render('authorization.ejs');
  else res.redirect('/newsFeed');
});
// router.route('/register').get((req, res, next) => {
//   res.render('register.ejs');
// });

// router.route('/forgotPassword').get((req, res, next) => {
//   res.render('forgotPassword.ejs');
// });

// router.use(authController.protectAccess);
router
  .route('/newsFeed')
  .get(authController.protectAccess, async (req, res, next) => {
    const post = await Post.find().populate({ path: 'authorId' });
    res.render('newsFeed.ejs', {
      allPosts: post,
    });
  });
router
  .route('/profile')
  .get(authController.protectAccess, async (req, res, next) => {
    const post = await Post.find();
    res.render('profile.ejs', { allPosts: post });
  });
module.exports = router;
