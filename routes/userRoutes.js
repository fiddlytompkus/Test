// authController protection is to be set in the post model but for checking purposes it has been set over here

const express = require('express');
const UserController = require('./../Controller/userController');
const authController = require('./../Controller/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updateMyPassword',
  authController.protectAccess,
  authController.updatePassword
);
router.patch(
  '/updateMe',
  authController.protectAccess,
  UserController.updateMe
);
router.delete(
  '/deleteMe',
  authController.protectAccess,
  UserController.deleteMe
);

router
  .route('/')
  .get(authController.protectAccess, UserController.GetAllUser)
  .post(UserController.CreateUser);

router
  .route('/:id')
  .get(UserController.GetUser)
  .patch(UserController.UpdateUser)
  .delete(
    authController.protectAccess,
    authController.restrictTo('admin'),
    UserController.DeleteUser
  );

module.exports = router;
