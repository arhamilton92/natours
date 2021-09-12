/** @format */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
	review: String,
	rating: {
		type: Number,
		values: [1, 2, 3, 4, 5],
		required: [true, 'Review must have a rating']
	},
	tour: {
		type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour.']
	},
	user: {
		type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user.']
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
