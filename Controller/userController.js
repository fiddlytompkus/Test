const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const SignToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.GetAllUser = catchAsync(async (req, res, next) => {
  const AllUser = await User.find();
  res.status(200).json({
    status: 'OK',
    data: {
      AllUser,
    },
  });
});

exports.CreateUser = catchAsync(async (req, res, next) => {
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
});

exports.login = catchAsync(async (req, res, next) => {
  const DReq = { ...req.body };
  const EmailORUsername = DReq.username;
  const password = DReq.password;
  if (!password || !EmailORUsername) {
    return next(new AppError('Username or password required', 500));
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
      return next(new AppError('email and Password is not correct', 401));
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
      return next(new AppError('username and Password is not correct', 401));
    }
  }
});

exports.GetUser = catchAsync(async (req, res, next) => {
  const IdUser = await User.findById(req.params.id);

  if (!IdUser) {
    return next(new AppError('No Tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'OK',
    data: {
      IdUser,
    },
  });
});

exports.UpdateUser = catchAsync(async (req, res, next) => {
  const IdUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!IdUser) {
    return next(new AppError('No Tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'OK',
    data: {
      IdUser,
    },
  });
});

exports.DeleteUser = catchAsync(async (req, res, next) => {
  const IdUser = await User.findByIdAndDelete(req.params.id);

  if (!IdUser) {
    return next(new AppError('No Tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'OK',
    data: null,
  });
});
