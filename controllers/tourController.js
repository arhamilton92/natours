/** @format */

const Tour = require('../models/tourModel');

exports.aliasTopTours = async (req, res, next) => {
	req.query.limit = '5';
	req.query.sort = '-ratingsAverage,price';
	req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
	next();
};

exports.getAllTours = async (req, res) => {
	try {
		// BUILD QUERY
		// 1: filtering
		const queryObj = { ...req.query };
		const excludedFields = ['page', 'sort', 'limit', 'fields'];
		excludedFields.forEach((el) => delete queryObj[el]);
		//

		// 2: advanced filtering
		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

		let query = Tour.find(JSON.parse(queryStr));

		// 3: sorting
		if (req.query.sort) {
			const sortBy = req.query.sort.split(',').join(' ');
			console.log(sortBy);
			query = query.sort(sortBy);
		} else {
			query = query.sort('price');
		}
		//

		// 4: field limiting

		if (req.query.fields) {
			const fields = req.query.fields.split(',').join(' ');
			query = query.select(fields);
		} else {
			query = query.select('-__v');
		}

		// 5: pagination

		const page = req.query.page * 1 || 1;
		const limit = req.query.limit * 1 || 100;
		const skip = (page - 1) * limit;
		if (req.query.page) {
			const numTours = await Tour.countDocuments();
			if (skip >= numTours) throw new Error('This page does not exist');
		}

		query = query.skip(skip).limit(limit);

		// EXECUTE QUERY
		const tours = await query;
		res.status(200).json(tours);
	} catch (error) {
		res.status(404).json({
			status: 'failed',
			error,
		});
	}
};

exports.getTour = async (req, res) => {
	try {
		const tour = await Tour.findById(req.params.id);
		//
		res.status(200).json(tour);
	} catch (error) {
		res.status(404).json({
			status: 'failed',
			error,
		});
	}
};

exports.createTour = async (req, res) => {
	try {
		const newTour = await Tour.create(req.body);
		//
		res.status(201).json({
			status: 'success',
			data: {
				tour: newTour,
			},
		});
	} catch (error) {
		res.status(400).json({
			status: 'failed',
			error,
		});
	}
};

exports.updateTour = async (req, res) => {
	try {
		const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		//
		res.status(200).json({
			status: 'success',
			message: tour,
		});
	} catch (error) {
		res.status(400).json({
			status: 'failed',
			error,
		});
	}
};

exports.deleteTour = async (req, res) => {
	try {
		await Tour.findByIdAndDelete(req.params.id);
		//
		res.status(204).json({
			status: 'success',
			message: 'tour deleted',
			data: null,
		});
	} catch (error) {
		res.status(400).json({
			status: 'failed',
			error,
		});
	}
};
