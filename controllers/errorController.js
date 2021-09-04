/** @format */

const handleCastErrorDB = err => {
	const message = `invalid ${err.path}: ${err.value}`;
	return(new AppError(message, 400))
}

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
		console.error('ERROR', err); // PROGRAMMING ERROR
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
		let errObj = { ...err };
		if (errObj.name === 'CastError') errObj = handleCastErrorDB(errObj);
		sendErrorProd(errObj, res);
	}
};
