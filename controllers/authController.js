/** @format */

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
	const newUser = await User.create(
		({ name, email, password, passwordConfirm } = req.body)
	);
	res.status(201).json({
		status: 'success',
		data: {
			user: newUser,
		},
	});
});
