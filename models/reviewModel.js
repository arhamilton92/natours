/** @format */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
	review: {
		type: String,
		required: true,
	},
	rating: {
		type: Number,
		values: [1, 2, 3, 4, 5],
		required: true,
	},
	tour: {
		type: mongoose.Schema.ObjectId,
		ref: 'Tour',
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
	},
	createdAt: {
		type: Date,
		default: Date.now(),
		select: false,
	},
}); // --------------------------------

// DOCUMENT MIDDLEWARE
// ------------------------------------

// QUERY MIDDLEWARE
// ------------------------------------

// INSTANCE METHOD
// ------------------------------------

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
