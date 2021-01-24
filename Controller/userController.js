const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const util = require('util'); //for promisfy function
const SignToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.GetAllUser = async (req, res) => {
  try {
    const AllUser = await User.find();
    res.status(200).json({
      status: 'OK',
      data: { AllUser },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.CreateUser = async (req, res) => {
  try {
    const newUser = {
      username: req.body.username,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      DOB: req.body.DOB,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };
    const NewUser = await User.create(newUser);
    const token = SignToken(NewUser._id);
    res.status(200).json({
      status: 'OK',
      data: {
        User: newUser,
        token: token,
      },
    });
  } catch (err) {
    res.status(402).json({
      status: 'Fail',
      message: err,
    });
  }
};

exports.login = async (req, res) => {
  const DReq = { ...req.body };
  const EmailORUsername = DReq.username;
  const password = DReq.password;

  // check password and email
  if (!password || !EmailORUsername) {
    return res.status(500).json({
      status: 'fail',
      message: 'Username or password required',
    });
  }
  if (validator.isEmail(EmailORUsername)) {
    const user = await User.findOne({ email: EmailORUsername }).select(
      '+password'
    );

    if (user && (await user.CheckPass(password, user.password))) {
      res.status(200).json({
        status: 'OK',
        token: SignToken(user._id),
      });
    } else {
      res.status(401).json({
        status: 'fail',
        message: 'userFrom email: Password or email wrong',
      });
    }
  } else {
    const user = await User.findOne({ username: EmailORUsername }).select(
      '+password'
    );
    if (user && (await user.CheckPass(password, user.password))) {
      res.status(200).json({
        status: 'OK',
        token: SignToken(user._id),
      });
    } else {
      res.status(401).json({
        status: 'fail',
        message: 'From username: Password or email wrong',
      });
    }
  }
};

exports.GetUser = async (req, res) => {
  try {
    const IdUser = await User.findById(req.params.id);
    res.status(200).json({
      status: 'OK',
      data: {
        IdUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err,
    });
  }
};

exports.UpdateUser = async (req, res) => {
  try {
    const IdUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'OK',
      data: {
        IdUser,
      },
    });
  } catch {
    res.status(404).json({
      status: 'Fail',
      message: err,
    });
  }
};

exports.DeleteUser = async (req, res) => {
  try {
    const IdUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'OK',
      data: null,
    });
  } catch {
    res.status(404).json({
      status: 'Fail',
      message: err,
    });
  }
};

//protecting user not to access non-authorized data if he/she is not logged in
exports.protectAccess = async (req, res, next) => {
  //1) get token and checks it's exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(400).json({
      status: 'fail',
      message: 'token required, login again',
    });
  }
  //2) validate is valid
  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  //3)check user is still exist
  const CurrentUser = await User.findById(decoded.id);
  if (!CurrentUser) {
    return res.status(400).json({
      status: 'fail',
      message: 'user does not not exist',
    });
  }
  //4) check if user changed passsword after token is generated
  if (CurrentUser.PasswordChanged(decoded.iat)) {
    return res.status(400).json({
      status: 'fail',
      message: 'user changed their password recently',
    });
  }
  next();
};
