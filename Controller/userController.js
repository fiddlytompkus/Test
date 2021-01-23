const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const validator = require('validator');

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
  //  console.log(EmailORUsername, '  ', password);

  //1). check password and email
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
