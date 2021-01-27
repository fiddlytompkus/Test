const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const util = require('util'); //for promisfy function
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');

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
  //res.status(200).render('users.ejs', { users: AllUser });
});

exports.CreateUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    DOB: req.body.DOB,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  console.log(newUser);
  const token = SignToken(newUser._id);
  res.status(200).json({
    status: 'OK',
    data: {
      User: newUser,
    },
    token: token,
  });
  const AllUser = await User.find();
  res.status(200).render('users.ejs', { users: AllUser });
  //res.status(200).redirect('/v1/users');
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
      //res.status(200).render('posts.ejs');
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
      //res.status(200).render('posts.ejs');
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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  //1) search user in database
  const user = await User.findOne({ email });
  if (!user)
    return next(new AppError('There is no data with entered email', 404));

  //2) create reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3) send mail to user
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/v1/user/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n If you didn't forget your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
      token: resetToken,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const resettoken = req.params.resetToken;
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(resettoken)
    .digest('hex');

  console.log(hashedToken);
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  const token = SignToken(user._id);
  res.status(200).json({
    status: 'success',
    token: token,
  });
});
