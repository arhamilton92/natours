/** @format */
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
	// get tours data
	const tours = await Tour.find();

	// build template

	//render template with data

	res.status(200).render('overview', {
		title: 'All Tours',
		tours,
	});
});

exports.getTour = catchAsync( async (req, res) => {
	const tour = await Tour.findOne({ slug: req.params.slug }).populate({
		path: 'reviews',
		fields: 'review rating user',
	});
	res.status(200).render('tour', {
		title: tour.name,
		tour,
	});
});
