const express = require('express');
const UserController = require('./../Controller/userController');

const router = express.Router();

router.route('/create').post(UserController.CreateUser);

module.exports = router;
