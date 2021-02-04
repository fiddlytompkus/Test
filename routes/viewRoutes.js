const express = require('express');

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
router.route('/newsFeed').get((req, res, next) => {
  res.render('newsFeed.ejs');
});
module.exports = router;
