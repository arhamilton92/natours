/** @format */

const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

exports.signup = catchAsync(async (req, res, next) => {
	const { name, email, password, passwordConfirm } = req.body
	const newUser = await User.create(
		({name, email, password, passwordConfirm})
	);
	const token = signToken(newUser._id);
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
		return next(new AppError('Please provide email and password', 400));
	}
	const user = await User.findOne({ email }).select('+password');
	//
	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError('Incorrect email or password', 401));
	}
	const token = signToken(user._id);
	//
	res.status(200).json({
		status: 'success',
		token,
	});
});

exports.protect = catchAsync(async (req, res, next) => {
	const auth = req.headers.authorization;
	let token;
	//
	// CHECK & DECODE TOKEN
	if (auth && auth.startsWith('Bearer ')) token = auth.split(' ')[1];
	if (!token) return new AppError('You are not logged in.', 401);
	const decodedToken = await promisify(jwt.verify)(
		token,
		process.env.JWT_SECRET
	);
	// CHECK USER EXISTS
	const freshUser = await User.findById(decodedToken.id);
	if (!freshUser) return next(new AppError('This user does not exist', 401));
	//
	// CHECK USER HAS NOT CHANGED PASSWORD
	if (await freshUser.changedPasswordAfter(decodedToken.iat)) {
		return next(
			new AppError('User recently changed password - please log in again.', 401)
		);
	}
	// GRANT ACCESS
	req.user = freshUser;
	next();
});
