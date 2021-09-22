/** @format */

const User = require('../models/userModel');
const multer = require('multer'); // file uploads
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const factory = require('./handlerfactory');

// MULTER SETUP
const multerStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/img/users');
	},
	filename: (req, file, cb) => {
		const ext = file.mimetype.split('/')[1];
		cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
	},
});
const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		cb(new AppError('Not an image! Please upload an image file.', 400), false);
	}
};
const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});

// v MIDDLEWARE v --------------------------
// -----------------------------------------
exports.getMe = (req, res, next) => {
	console.log('getme');
	req.params.id = req.user.id;
	console.log(req.params.id);
	next();
};
exports.uploadUserPhoto = upload.single('photo');
// -----------------------------------------
// ^ MIDDLEWARE ^ --------------------------

// FUNCTIONS
const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateMe = catchAsync(async (req, res, next) => {
	console.log(req.file);
	console.log(req.body);
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
});
exports.updateUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'Route does not exist. Please use /updateme',
	});
};
exports.deleteMe = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, { active: false });
	//
	res.status(204).json({
		status: 'success',
		data: null,
	});
});
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
