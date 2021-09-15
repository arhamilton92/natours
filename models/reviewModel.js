/** @format */

const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema({
	review: String,
	rating: {
		type: Number,
		values: [1, 2, 3, 4, 5],
		required: [true, 'Review must have a rating'],
	},
	tour: {
		type: mongoose.Schema.ObjectId,
		ref: 'Tour',
		required: [true, 'Review must belong to a tour.'],
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: [true, 'Review must belong to a user.'],
	},
	createdAt: {
		type: Date,
		default: Date.now(),
		select: false,
	},
}); // --------------------------------

// DOCUMENT MIDDLEWARE
reviewSchema.post(/save|^findOne/, async (doc, next) => {
    await doc.constructor.calculateAverageRating(doc.tour);
    next();
}); // --------------------------------
// ------------------------------------

// QUERY MIDDLEWARE
reviewSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'user',
		select: 'name photo',
	});
	next();
});
// ------------------------------------

// INSTANCE METHOD
// ------------------------------------

// STATIC METHOD
reviewSchema.statics.calculateAverageRating = async function (tourId) {
	console.log('hello')
	const stats = await this.aggregate([
		{
			$match: { tour: tourId },
		},
		{
			$group: {
				_id: '$tour',
				nRating: { $sum: 1 },
				avgRating: { $avg: '$rating' },
			},
		},
	]);
	console.log(stats);
	await Tour.findByIdAndUpdate(tourId, {
		ratingsQuantity: stats[0].nRating,
		ratingsAverage: stats[0].avgRating,
	});
}; // ---------------------------------
// ------------------------------------

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
