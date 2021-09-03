/** @format */

const mongoose = require('mongoose');

// SCHEMA
const tourSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'A tour must have a name'],
		unique: true,
		trim: true,
	},
	duration: {
		type: Number,
		required: [true, 'A tour must have a duration'],
	},
	maxGroupSize: {
		type: Number,
		required: [true, 'A tour must have a group size'],
	},
	difficulty: {
		type: String,
		required: [true, 'A tour must have a difficulty'],
		trim: true,
	},
	ratingsAverage: {
		type: Number,
		default: 4.5,
	},
	ratingsQuantity: {
		type: Number,
		default: 0,
	},
	price: {
		type: Number,
		required: [true, 'A tour must have a price'],
	},
	discountPrice: Number,
	summary: {
		type: String,
		trim: true,
		required: true
	},
	description: {
		type: String,
		trim: true
	},
	imageCover: {
		type: String,
		required: [true, 'A tour must hav a cover image']
	},
	images: [String],
	createdAt: {
		type: Date,
		default: Date.now()
	},
	startDates: [Date]
}); // --------------------------------

// MODEL
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
// ------------------------------------
