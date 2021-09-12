/** @format */

const Review = require('../models/reviewModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
	const features = new APIFeatures(Review.find(), req.query)
		.filter()
		.sort()
		.limitFields()
		.paginate();
	const reviews = await features.query;
	//
	res.status(200).json({
		status: 'success',
		results: reviews.length,
		data: reviews,
	});
}); // --------------------------------

exports.getReview = catchAsync(async (req, res, next) => {
	const review = await Review.findById(req.params.id).populate().exec();
	if (!review) {
		return next(new AppError('No review found with that ID', 404));
	}
	res.status(200).json({
		status: 'success',
		data: review,
	});
}); // --------------------------------

exports.createReview = catchAsync(async (req, res, next) => {
	const newReview = await Review.create(req.body);
	//
	res.status(201).json({
		status: 'success',
		data: {
			tour: newReview,
		},
	});
}); // --------------------------------