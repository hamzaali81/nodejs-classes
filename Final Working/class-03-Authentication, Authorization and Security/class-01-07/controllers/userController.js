const User = require("../models/userModel");
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async(req, res,next) => {
  const users = await User.find(req.body);

    res.status(200).json({
      users: users.length,
      status: "success",
      data: {
        users,
      },
    });
});
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
