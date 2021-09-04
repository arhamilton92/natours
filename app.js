/** @format */

const express = require('express');
const morgan = require('morgan');

const app = express();

// MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
	console.log('development');
	app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
// ------------------------------------

// ROUTER
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
//
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// incorrect URL error
app.all('*', (req, res, next) => {
	const err = new Error(`Can't find ${req.originalUrl}`)
	err.status = 'failed';
	err.statusCode = 404
	//
	next(err)
});
// error handling
app.use((err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	//
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
	});
}); // --------------------------------

module.exports = app;
