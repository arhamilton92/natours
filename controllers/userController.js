/** @format */

const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const factory = require('./handlerfactory')


const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
}; // --------------------------------

exports.getAllUsers = catchAsync(async (req, res, next) => {
	const features = new APIFeatures(User.find(), req.query);
	const users = await features.query;
	//
	res.status(200).json({
		status: 'success',
		results: users.length,
		data: users,
	});
}); // --------------------------------

exports.getUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'route not yet implemented',
	});
}; // --------------------------------

exports.updateMe = catchAsync(async (req, res, next) => {
	if (req.body.password || req.body.passwordConfirm) {
		return next(
			new AppError(
				'Cannot update password via this route. Please use /updatemypassword',
				400
			)
		);
	}
	const filteredBody = filterObj(req.body, 'name', 'email');
	const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
		new: true,
		runValidators: true,
	});
	res.status(200).json({
		status: 'success',
		data: {
			user: updatedUser,
		},
	});
}); // --------------------------------

exports.updateUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'route not yet implemented',
	});
}; // --------------------------------

exports.deleteMe = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, { active: false });
	//
	res.status(204).json({
		status: 'success',
		data: null,
	});
}); // --------------------------------

exports.updateUser = factory.updateOne(User)
// ------------------------------------
exports.deleteUser = factory.deleteOne(User);
// ------------------------------------