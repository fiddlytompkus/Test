const User = require('../models/userModel');

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
    await User.create(newUser);
    res.status(200).json({
      status: 'OK',
      data: { newUser },
    });
  } catch (err) {
    res.status(402).json({
      status: 'Fail',
      message: err,
    });
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
  } catch {
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
