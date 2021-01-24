const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const util = require('util'); //for promisfy function
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const SignToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.GetAllUser = catchAsync(async (req, res, next) => {
  const AllUser = await User.find();
  // res.status(200).json({
  //   status: 'OK',
  //   data: {
  //     AllUser,
  //   },
  // });
  res.status(200).render("users.ejs",{users:AllUser});
});

exports.CreateUser = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const newUser = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    DOB: req.body.DOB,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm, 
  };
  console.log(newUser);
  const nUser = await User.create(newUser);
  console.log(nUser);
  const token = SignToken(nUser._id);
  // res.status(200).json({
  //   status: 'OK',
  //   data: {
  //     User: newUser,
  //     token: token,
  //   },
  // });
  // const AllUser = await User.find();
  // res.status(200).render("users.ejs",{users:AllUser});
  res.status(200).redirect("/v1/users");
});

exports.login = catchAsync(async (req, res, next) => {
  const DReq = { ...req.body };
  const EmailORUsername = DReq.username;
  const password = DReq.password;

  // check password and email
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
});

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
