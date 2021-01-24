const express = require('express');
const UserController = require('./../Controller/userController');

const router = express.Router('/v1/users');

router
  .route('/login')
  .post(UserController.login)
  .get((req, res) => {
    res.render('login.ejs');
  });

router
  .route('/')
  .get(UserController.protectAccess, UserController.GetAllUser)
  .post(UserController.CreateUser);

router.route('/register').get((req, res) => {
  res.render('register.ejs');
});

router
  .route('/:id')
  .get(UserController.GetUser)
  .patch(UserController.UpdateUser)
  .delete(UserController.DeleteUser);

module.exports = router;
