/** @format */
const AppError = require('../utils/AppError');

// MONGODB/MONGOOSE ERROR HANDLING
const handleCastErrorDB = (err) => {
	const message = `invalid ${err.path}: ${err.value}`;
	return new AppError(message, 400);
};
//
const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `Invalid input data: ${errors.join('. ')}`;
	return new AppError(message, 400);
};
//
const handleDuplicateFieldsDB = (err) => {
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
	console.log(value);
	const message = `Duplicate field value: ${value}.`;
	return new AppError(message, 400);
}; // ---------------------------------

// JWT ERRORS
const handleJWTError = (err) =>
	new AppError('Invalid token. Please log in again.', 401);
const handleJWTExpired = (err) =>
	new AppError('Expired token. Please log in again.', 401);
// ------------------------------------

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		error: err,
		stack: err.stack,
	});
};

const sendErrorProd = (err, res) => {
	if (err.isOperational) {
		// OPERATIONAL ERROR
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		// PROGRAMMING ERROR
		res.status(500).json({
			status: 'error',
			message: 'Something went wrong',
		});
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	//
	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === 'production') {
		let error = Object.assign(err);
		//
		if (error.name === 'CastError') error = handleCastErrorDB(error);
		if (error.name === 'ValidationError')
			error = handleValidationErrorDB(error);
		if (error.code === 11000) error = handleDuplicateFieldsDB(error);
		if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
		if (error.name === 'TokenExpiredError') error = handleJWTExpired(error);
		sendErrorProd(error, res);
	}
};
