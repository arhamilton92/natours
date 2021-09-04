/** @format */

const mongoose = require('mongoose');
const slugify = require('slugify');

// SCHEMA
const tourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'A tour must have a name'],
			unique: true,
			trim: true,
		},
		slug: String,
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
			required: true,
		},
		description: {
			type: String,
			trim: true,
		},
		imageCover: {
			type: String,
			required: [true, 'A tour must hav a cover image'],
		},
		images: [String],
		createdAt: {
			type: Date,
			default: Date.now(),
			select: false,
		},
		startDates: [Date],
		secretTour: {
			type: Boolean,
			default: false,
		},
	},
	{
		toJSON: { virtuals: true },
	}
); // --------------------------------

// VIRTUALS
tourSchema.virtual('durationWeeks').get(function () {
	return this.duration / 7;
}); // --------------------------------

// DOCUMENT MIDDLEWARE
tourSchema.pre('save', function (next) {
	// RUNS BEFORE .save() & .create()
	this.slug = slugify(this.name, { lower: true });
	next();
}); // --------------------------------

// QUERY MIDDLEWARE
tourSchema.pre('find', function (next) {
	this.find({ secretTour: false });
	next();
}); // --------------------------------

// MODEL
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
// ------------------------------------
