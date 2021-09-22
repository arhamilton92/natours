/** @format */
const AppError = require('../utils/AppError');

// v MONGO ERROR v 
// -----------------------------------------
const handleCastErrorDB = (err) => {
	const message = `invalid ${err.path}: ${err.value}`;
	return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `Invalid input data: ${errors.join('. ')}`;
	return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
	console.log(value);
	const message = `Duplicate field value: ${value}.`;
	return new AppError(message, 400);
};
// -----------------------------------------
// ^ MONGO ERROR ^ 

// v JWT ERROR v 
// -----------------------------------------
const handleJWTError = () =>
	new AppError('Invalid token. Please log in again.', 401);
const handleJWTExpired = () =>
	new AppError('Expired token. Please log in again.', 401);
// -----------------------------------------
// ^ JWT ERROR ^ 

const sendErrorDev = (err, req, res) => {
	if (req.originalUrl.startsWith('/api')) {
		//API
		return res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
			error: err,
			stack: err.stack,
		});
	}
	// RENDERED WEBSITE
	res.status(err.statusCode).render('error', {
		title: 'Something went wrong',
		msg: err.message,
	});
};

const sendErrorProd = (err, req, res) => {
	if (req.originalUrl.startsWith('/api')) {
		// API
		if (err.isOperational) {
			// OPERATIONAL ERROR
			return res.status(err.statusCode).json({
				status: err.status,
				message: err.message,
			});
		}
		// PROGRAMMING ERROR
		return res.status(500).json({
			status: 'error',
			message: 'Something went wrong',
		});
	} else {
		// RENDERED WEBSITE
		if (err.isOperational) {
			return res.status(err.statusCode).render('error', {
				title: 'Something went wrong',
				msg: err.message,
			});
		}
		return res.status(err.statusCode).render('error', {
			title: 'Something went wrong',
			msg: 'Please try again later.',
		});
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	//
	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, req, res);
	} else if (process.env.NODE_ENV === 'production') {
		let error = Object.assign(err);
		//
		if (error.name === 'CastError') error = handleCastErrorDB(error);
		if (error.name === 'ValidationError')
			error = handleValidationErrorDB(error);
		if (error.code === 11000) error = handleDuplicateFieldsDB(error);
		if (error.name === 'JsonWebTokenError') error = handleJWTError();
		if (error.name === 'TokenExpiredError') error = handleJWTExpired();
		sendErrorProd(error, req, res);
	}
};
