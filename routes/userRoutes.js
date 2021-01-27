const express = require('express');
const UserController = require('./../Controller/userController');

const router = express.Router();

////
router
  .route('/')
  .get(UserController.protectAccess, UserController.GetAllUser)
  .post(UserController.CreateUser);

router.route('/login').post(UserController.login);
router.route('/forgotPassword').post(UserController.forgotPassword);
router.route('/resetPassword/:resetToken').patch(UserController.resetPassword);

router
  .route('/:id')
  .get(UserController.GetUser)
  .patch(UserController.UpdateUser)
  .delete(UserController.DeleteUser);

module.exports = router;
