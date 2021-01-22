const express = require('express');
const UserController = require('./../Controllers/userControllers');

const router = express.Router();

router
  .route('/')
  .get(UserController.GetAllUsers)
  .post(UserController.CreateUser);

module.exports = router;
