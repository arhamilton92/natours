/** @format */

const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
//
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// GLOBAL MIDDLEWARE
app.use(helmet()); // SECURITY HTTP HEADERS
if (process.env.NODE_ENV === 'development') {
	console.log('development');
	app.use(morgan('dev')); // DEV LOGGING
}
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/api', limiter); // LIMIT IP REQ RATE
//
app.use(express.json({ limit: '10kb' })); // PARSE BODY & LIMIT TO 10kb SIZE
//
app.use(mongoSanitize()); // DATA SANITIZATION AGAINST noSQL QUERY INJECTION
//
app.use(xss()); // DATA SANITIZATION AGAINST XSS
//
app.use(
	// PREVENT PARAM POLLUTION
	hpp({
		whitelist: [
			'duration',
			'difficulty',
			'price',
			'ratingsQuantity',
			'ratingsAverage',
			'maxGroupSize',
		],
	})
);
app.use(express.static(`${__dirname}/public`)); // SERVE STATIC FILES
// ------------------------------------

// ROUTER
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//
app.all('*', (req, res, next) => {
	// incorrect URL error
	next(new AppError(`Can't find ${req.originalUrl}`, 404));
});
app.use(globalErrorHandler);
// --------------------------------

module.exports = app;
