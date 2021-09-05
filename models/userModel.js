/** @format */

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
		validate: [validator.isEmail, 'Please enter a valid email'],
	},
	photo: String,
	password: {
		type: String,
		required: [true, 'Please enter a password'],
		minLength: [8, 'A password must have minimum 8 characters'],
	},
	passwordConfirm: {
		type: String,
		required: [true, 'Both password fields must match'],
		validate: {
			validator: function (el) {
				return el === this.password;
			},
			message: 'Passwords are not the same',
		},
	},
}); // --------------------------------

// DOCUMENT MIDDLEWARE
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	//
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next()
}); // --------------------------------

// MODEL
const User = mongoose.model('User', userSchema);
module.exports = User;
// ------------------------------------
