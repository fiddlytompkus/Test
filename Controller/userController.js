const User = require('../models/userModel');
const validator = require('validator');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { post } = require('../routes/userRoutes');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.GetAllUser = catchAsync(async (req, res, next) => {
  const AllUser = await User.find();
  res.status(200).json({
    status: 'OK',
    length: AllUser.length,
    data: {
      AllUser,
    },
  });
  //res.status(200).render('users.ejs', { users: AllUser });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create an Error If User tries to update Password (Post Password Data)
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password Updates. Please Use /updateMyPassword',
        400
      )
    );
  }

  // Filtered Out unwanted fields name that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'username',
    'email',
    'DOB',
    'photo',
    'firstname',
    'lastname',
    'phoneNumber'
  );

  // 2) Update User Document
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.CreateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.GetUser = catchAsync(async (req, res, next) => {
  const IdUser = await User.findById(req.params.id);

  if (!IdUser) {
    return next(new AppError('No user found with that ID', 404));
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
    return next(new AppError('No user found with that ID', 404));
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
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.addFriend = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const searchedUser = await User.findById(userId);
  if (searchedUser) {
    const CurrentUser = await User.findById(req.user.id);
    const index = CurrentUser.friendList.indexOf(userId);
    if (index == -1) {
      CurrentUser.friendList.push(userId);
      CurrentUser.save({ validateBeforeSave: false });
    }
    return res.status(200).json({
      status: 'Success',
    });
  } else {
    return next(new AppError('No user found with given id', 404));
  }
});
exports.removeFriend = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const searchedUser = await User.findById(userId);
  if (searchedUser) {
    const CurrentUser = await User.findById(req.user.id);
    const index = CurrentUser.friendList.indexOf(userId);
    if (index > -1) {
      CurrentUser.friendList.splice(index, 1);
      CurrentUser.save({ validateBeforeSave: false });
    }
    return res.status(200).json({
      status: 'Success',
    });
  } else {
    return next(new AppError('No user found with given id', 404));
  }
});
