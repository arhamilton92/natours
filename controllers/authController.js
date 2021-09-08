/** @format */

const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/email');

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

exports.signup = catchAsync(async (req, res, next) => {
	const { name, email, password, passwordConfirm } = req.body;
	const newUser = await User.create({ name, email, password, passwordConfirm });
	const token = signToken(newUser._id);
	res.status(201).json({
		status: 'success',
		data: {
			user: newUser,
		},
		token,
	});
});

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(new AppError('Please provide email and password', 400));
	}
	//
	const user = await User.findOne({ email }).select('+password');
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

exports.forgotPassword = catchAsync(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });
	if (!user)
		return next(new AppError('There is no user with that email address', 404));
	//
	const resetToken = user.createPasswordResetToken(); 		// GENERATE RESET TOKEN
	await user.save({ validateBeforeSave: false });				// SAVE
	// 
	//
	const resetURL = `${req.protocol}://${req.get(
		'host'
	)}/api/v1/users/resetpassword/${resetToken}`;
	//
	const text = `Forgot your password? Submit a PATCH request with your new password to:\n\n${resetURL}\n\nIf you didn't submit a password request, please ignore this email.`;
	try {
		await sendEmail({										// SEND EMAIL
			email: user.email,
			subject: 'Your password reset token(valid for 10 min)',
			text,
		});
		//
		res.status(200).json({
			status: 'success',
			message: 'Token to email!',
		});
	} catch (error) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });
		//
		return next(await new AppError('There was an error sending the email. Please try again later.', 500))
	}
});

exports.resetPassword = catchAsync(async (req, res, next) => {
	next();
});

exports.protect = catchAsync(async (req, res, next) => {
	const auth = req.headers.authorization;
	let token;
	//
	// CHECK & DECODE TOKEN
	if (auth && auth.startsWith('Bearer ')) token = auth.split(' ')[1];
	if (!token) return next(new AppError('You are not logged in.', 401));
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

exports.restrict = (roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role))
			// roles is an array ['admin', 'lead']
			return next(
				new AppError('You do not have permission to perform this action', 403)
			);
		//
		next();
	};
};
