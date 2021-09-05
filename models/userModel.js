/** @format */

const mongoose = require('mongoose');
const validator = require('validator');

// SCHEMA
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'name is required'],
		trim: true,
	},
	email: {
		type: String,
		required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email']
	},
	photo: String,
	password: {
		type: String,
		required: [true, 'Please enter a password'],
		minLength: [8, 'A password must have minimum 8 characters'],
	},
    passwordConfirm: {
        type: String,
        required: [true, 'Both password fields must match']
    }
}); // --------------------------------

// MODEL
const user = mongoose.model('User', userSchema);
module.exports = User;
// ------------------------------------
