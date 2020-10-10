const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const {
  getAll,
  deleteOne,
  updateOne,
  getOne
} = require('./../controllers/handlerFactory');

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message:
      'This route can not be used for creating users, use /signup instead'
  });
};

exports.getAllUsers = getAll(User);
exports.getUser = getOne(User);
exports.deleteUser = deleteOne(User);

// NEVER user For Changing PASSWORD
exports.updateUser = updateOne(User);
