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
			maxLength: [40, 'A tour name must only have up to 40 characters'],
			minLength: [8, 'A tour name must have minimum 8 characters'],
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
			enum: {
				values: ['easy', 'medium', 'difficult'],
				message: 'Accepted values: easy, medium, difficult',
			},
		},
		ratingsAverage: {
			type: Number,
			default: 4.5,
			min: [1, 'Rating must be between 1 and 5'],
			max: [5, 'Rating must be between 1 and 5'],
		},
		ratingsQuantity: {
			type: Number,
			default: 0,
		},
		price: {
			type: Number,
			required: [true, 'A tour must have a price'],
		},
		discountPrice: {
			type: Number,
			validate: {
				validator: function (val) {
					// WILL NOT WORK ON UPDATE
					return val < this.price;
				},
				message:
					'Discount price ({VALUE}) must be lower than the regular price',
			},
		},
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
		secret: {
			type: Boolean,
			default: false,
		},
		startLocation: {
			// GeoJSON
			type: {
				type: String,
				default: 'Point',
				enum: ['Point'],
			},
			coordinates: [Number],
			address: String,
			description: String,
		},
		locations: [
			{
				// GeoJSON
				type: {
					type: String,
					default: 'Point',
					enum: ['Point'],
				},
				coordinates: [Number],
				address: String,
				description: String,
				day: Number,
			},
		],
		guides: [{
			type: mongoose.Schema.ObjectId,
			ref: 'User'
		}],
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
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
tourSchema.pre(/^find/, function (next) {
	this.find({ secretTour: false });
	this.start = Date.now();
	next();
});
//
tourSchema.post(/^find/, function (docs, next) {
	console.log('-----');
	console.log(`Query time elapsed: ${Date.now() - this.start} milliseconds`);
	next();
}); // --------------------------------

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
	this.pipeline().unshift({ $match: { secretTour: false } });
	console.log(this.pipeline());
	next();
}); // --------------------------------

// MODEL
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
// ------------------------------------
