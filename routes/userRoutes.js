const express = require('express');
const UserController = require('./../Controller/userController');

const router = express.Router('/v1/users');

router.route('/login').post(UserController.login);

router
  .route('/')
  .get(UserController.GetAllUser)
  .post(UserController.CreateUser);

router
  .route('/:id')
  .get(UserController.GetUser)
  .patch(UserController.UpdateUser)
  .delete(UserController.DeleteUser);
module.exports = router;
