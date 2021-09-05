/** @format */

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');

exports.signup = catchAsync(async (req, res, next) => {
	const newUser = await User.create(
		({ name, email, password, passwordConfirm } = req.body)
	);
	const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
	res.status(201).json({
		status: 'success',
		data: {
			user: newUser,
			token,
		},
	});
});

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	//
	if (!email || !password) {
		return next(new appError('Please provide email and password', 400));
	}
	const user = User.findOne({ email });
	const token = 'asdsdfjkfds';
	res.status(200).json({
		status: 'success',
		data: token,
	});
});