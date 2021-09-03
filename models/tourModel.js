const mongoose = require('mongoose')

// SCHEMA
const tourSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'A tour must have a name'],
		unique: true,
	},
	price: {
		type: Number,
		required: [true, 'A tour must have a price'],
	},
	rating: {
		type: Number,
		default: 4.5,
	},
}); // --------------------------------

// MODEL
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
// ------------------------------------