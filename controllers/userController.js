const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync')

exports.getAllUsers = catchAsync(async (req, res, next) => {
	const features = new APIFeatures(User.find(), req.query)
	const users = await features.query;
	//
	res.status(200).json({
		status: 'success',
		results: users.length,
		data: users,
	});
});


exports.getUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'route not yet implemented',
	});
};

exports.createUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'route not yet implemented',
	});
};

exports.updateUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'route not yet implemented',
	});
};

exports.deleteUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'route not yet implemented',
	});
};