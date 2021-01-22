const User = require('../models/userModel');

exports.CreateUser = function (req, res) {
  const newUser = {
    username: req.body.username,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    DOB: req.body.DOB,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  };
  //   console.log(req.body);
  User.create(newUser, function (err, newUser) {
    if (err) {
      console.log(err);
    } else {
      console.log(newUser);
    }
  });
};
