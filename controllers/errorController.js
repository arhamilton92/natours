/** @format */
const AppError = require('../utils/AppError');

// MONGO/MONGOOSE ERROR HANDLING
const handleCastErrorDB = (err) => {
	const message = `invalid ${err.path}: ${err.value}`;
	return new AppError(message, 400);
}; 
//
const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map(el => el.message)
	const message = `Invalid input data: ${errors.join('. ')}`
	return new AppError(message, 400);
};
//
const handleDuplicateFieldsDB = (err) => {
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
	console.log(value)
	const message = `Duplicate field value: ${value}.`;
	return new AppError(message, 400);
}; // ---------------------------------

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
		let errObj = Object.assign(err);
		//
		if (errObj.name === 'CastError') errObj = handleCastErrorDB(errObj);
		if (errObj.name === 'ValidationError') errObj = handleValidationErrorDB(errObj);
		if (errObj.code === 11000) errObj = handleDuplicateFieldsDB(errObj);
		sendErrorProd(errObj, res);
	}
};
